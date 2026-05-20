# Michanoku Clubhouse
The Odin Project Members Only Project

## Models (plan)
 - User (firstname, lastname, username(email), passwords, membership-status, admin-status)
 - Message (title, body, timestamp, userid (foreign key to user))

## Views (plan)
 - Index
 - Register
 - Login
 - Logout (just a button I guess)
 - Join Club Page (with hidden admin password)
 - Create Message view

## Memberships 
 - Guest (automatic)
 - Member (upon secret password entry)
 - Admin 

 ## Others 
  - Sanitization
  - Validation 
  - Testing
  - passwords with bcrypt
  - Custom Validator on confirm field for register passwords
  - Guests can post messages
  - Only members can see names and dates on messages, guests only see message bodies
  - Only admins can see the delete button and delete messages


