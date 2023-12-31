use diesel::{Insertable, Queryable};
use serde::{Deserialize, Serialize};

use crate::schema::users;

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, Insertable)]
#[diesel(table_name = users)]
pub struct User {
    pub id: String,
    pub type_: String,
    pub image_id: Option<String>,
    pub name: String,
    pub last_name: String,
    pub birth_date: String,
    pub sex: String,
    pub phone: String,
    pub email: String,
    pub password_hash: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct New {
    pub image_id: Option<String>,
    pub name: String,
    pub last_name: String,
    pub birth_date: String,
    pub sex: String,
    pub phone: String,
    pub email: String,
    pub password: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Public {
    pub id: String,
    pub r#type: String,
    pub image_id: Option<String>,
    pub name: String,
    pub last_name: String,
    pub birth_date: String,
    pub sex: String,
    pub phone: String,
    pub email: String,
}

impl User {
    pub fn to_public(&self) -> Public {
        Public {
            id: self.id.clone(),
            r#type: self.type_.clone(),
            image_id: self.image_id.clone(),
            name: self.name.clone(),
            last_name: self.last_name.clone(),
            birth_date: self.birth_date.clone(),
            sex: self.sex.clone(),
            phone: self.phone.clone(),
            email: self.email.clone(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Search {
    pub r#type: Option<String>,
    pub name: Option<String>,
    pub last_name: Option<String>,
    pub birth_date: Option<String>,
    pub sex: Option<String>,
    pub phone: Option<String>,
    pub email: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Update {
    pub r#type: Option<String>,
    pub image_id: Option<String>,
    pub name: Option<String>,
    pub last_name: Option<String>,
    pub birth_date: Option<String>,
    pub sex: Option<String>,
    pub phone: Option<String>,
    pub email: Option<String>,
    pub password: Option<String>,
}
