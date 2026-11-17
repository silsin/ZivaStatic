import logging

from celery import Celery
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.config import settings

logger = logging.getLogger(__name__)

celery_app = Celery("tasks", broker=settings.REDIS_URL, backend=settings.REDIS_URL)

# Celery workers use a sync psycopg2 connection (not asyncpg).
SYNC_DATABASE_URL = settings.DATABASE_URL.replace(
    "postgresql+asyncpg://", "postgresql+psycopg2://"
)
SyncEngine = create_engine(SYNC_DATABASE_URL)
SyncSessionLocal = sessionmaker(bind=SyncEngine)


@celery_app.task(bind=True, max_retries=3)
def provision_server_task(self, server_id: str):
    # Import here to avoid circular imports at module load time
    from app.services.provisioning import provision_server

    db = SyncSessionLocal()
    try:
        provision_server(server_id, db)
        logger.info("Server %s provisioned successfully.", server_id)
    except Exception as exc:
        logger.error("Failed to provision server %s: %s", server_id, exc)
        db.rollback()
        raise self.retry(exc=exc, countdown=60)
    finally:
        db.close()
