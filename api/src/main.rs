use std::env;
use std::error::Error;

use actix_cors::Cors;
use actix_web::{middleware, web, App, HttpServer};
use diesel::r2d2::ConnectionManager;
use diesel::sqlite::Sqlite;
use diesel::{r2d2, SqliteConnection};
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use dotenv::dotenv;

pub mod appointment;
pub mod auth;
mod product;
mod resources;
pub mod schema;
pub mod user;
pub mod favorites;

pub type Pool = r2d2::Pool<ConnectionManager<SqliteConnection>>;

pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!();

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    // Initialize logger
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    // Setup database connection pool
    let pool = initialize_db_pool();

    // Run migrations
    run_migrations(&mut *pool.get().unwrap()).unwrap();

    // Get port from environment variable
    let port: u16 = env::var("PORT")
        .unwrap_or("8080".to_string())
        .parse()
        .expect("PORT must be a number");

    // Get address from environment variable
    let address: String = env::var("ADDRESS").unwrap_or("0.0.0.0".to_string());

    // Start HTTP server
    if address.eq("0.0.0.0") || address.eq("127.0.0.1") {
        log::info!("starting API server at http://localhost:{}", port);
    } else {
        log::info!("starting API server at http://{}:{}", address, port);
    }
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .wrap(middleware::Logger::default())
            .wrap(Cors::permissive())
            .configure(auth::init_routes)
            .configure(product::init_routes)
            .configure(resources::init_routes)
            .configure(user::init_routes)
            .configure(appointment::init_routes)
            .configure(favorites::init_routes)
    })
    .bind((address, port))?
    .run()
    .await
}

pub fn initialize_db_pool() -> Pool {
    let database_url = env::var("DATABASE_URL").unwrap_or("file:data.db".to_string());
    let manager = ConnectionManager::<SqliteConnection>::new(database_url);
    Pool::builder()
        .test_on_check_out(true)
        .build(manager)
        .expect("Could not build connection pool")
}

fn run_migrations(
    connection: &mut impl MigrationHarness<Sqlite>,
) -> Result<(), Box<dyn Error + Send + Sync + 'static>> {
    connection.run_pending_migrations(MIGRATIONS)?;
    Ok(())
}
