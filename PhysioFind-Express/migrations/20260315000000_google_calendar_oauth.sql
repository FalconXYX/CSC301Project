alter table users
    add column if not exists google_access_token   
  text,
    add column if not exists google_refresh_token  
  text,
    add column if not exists google_token_expiry   
  timestamptz,
    add column if not exists google_calendar_id    
  text;

  alter table appointment_requests
    add column if not exists google_event_id text; 
