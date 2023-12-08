use actix_web::{error, get, post, web, HttpResponse, Responder, delete, HttpRequest};
use actix_web::http::header::Header;
use actix_web_httpauth::headers::authorization::{Authorization, Bearer};
use uuid::Uuid;

use crate::user::actions;
use crate::user::models::New;
use crate::{auth, Pool};

#[get("/users/{user_id}")]
pub async fn get_user(
    pool: web::Data<Pool>,
    user_uid: web::Path<Uuid>,
) -> actix_web::Result<impl Responder> {
    let user_uid = user_uid.into_inner();
    let user = web::block(move || {
        let mut conn = pool.get()?;
        actions::find_user_by_uid(&mut conn, user_uid)
    })
    .await?
    .map_err(error::ErrorInternalServerError)?;

    Ok(match user {
        Some(user) => HttpResponse::Ok().json(user),
        None => HttpResponse::NotFound().body(format!("No user found with UID: {user_uid}")),
    })
}

#[post("/users")]
pub async fn add_user(
    pool: web::Data<Pool>,
    form: web::Json<New>,
) -> actix_web::Result<impl Responder> {
    let user = web::block(move || {
        let mut conn = pool.get()?;

        actions::insert_new_user(&mut conn, form.clone())
    })
    .await?
    .map_err(error::ErrorInternalServerError)?;
    Ok(HttpResponse::Created().json(user))
}

#[delete("/users/{user_id}")]
pub async fn delete_user(
    pool: web::Data<Pool>,
    user_uid: web::Path<Uuid>,
    req: HttpRequest,
) -> actix_web::Result<impl Responder> {
    let auth = Authorization::<Bearer>::parse(&req)?;
    let user_uid = user_uid.into_inner();
    let message = web::block(move || {
        let mut conn = pool.get()?;

        // Check if user is admin or employee
        let is_admin_or_employee =
            auth::actions::is_admin_or_employee(&mut conn, auth.as_ref().token())?;

        if is_admin_or_employee {
            return actions::delete_user_by_uid(&mut conn, user_uid);
        }

        let is_user = auth::actions::is_user(&mut conn, auth.as_ref().token())?;

        if is_user {
            let user_id = auth::actions::get_user_id(&mut conn, auth.as_ref().token())?;

            if user_id == user_uid.to_string() {
                return actions::delete_user_by_uid(&mut conn, user_uid);
            }

        }
        Err("Unauthorized".into())
    })
    .await?
    .map_err(error::ErrorInternalServerError)?;
    Ok(HttpResponse::Ok())
}
