# Car registration

**FR**
Should be able to register a new car.

**BR**
Should not be able to register a car with license plate that already is registered.
The car should be registered as available by default.
The user that registers a car must be an administrator.

# Car listing

**FR**
Should be able to list all available cars.
Should be able to list all available cars by a category's name.
Should be able to list all available cars by a brand's name.
Should be able to list all available cars by a car's name.

**BR**
The user does not need to be logged in to list cars.

# Car specification registration

**FR**
Should be able to register a car specification.

**BR**
Should not be able to register a specification for a car that is not registered.
Should not be able to register a specification that already exists for the same car.
The user that registers a specification must be an administrator.

# Car images registration

**FR**
Should be able to register an image for a car.

**NFR**
Use multer to upload files.

**BR**
The user should be able to upload more than one image for each car.
The user that registers a car image must be an administrator.

# Car rental

**FR**
Should be able to register a car rental.

**BR**
The rental must have a duration of at least 24 hours.
Should not be able to register a rental if there's an on-going rental for the same user.
Should not be able to register a rental if there's an on-going rental for the same car.
User requesting a rental must be logged in.
When renting a car, the car's status must be changed to unavailable.

# Return rental car

**FR**
Must be able to return a rental car.

**BR**
If the car is returned within 24 hours, the price must be one of whole day.
When returning a car, the car must be available to be rented again.
When returning a car, the user should be able to iniate another rental.
When returning a car, the total price of the rental must be calculated.
If the return date exceeds the expected return date, an additional fee must be charged proportionally to how late the return was.
The additional fee for late return must be summed to the total price of the rental.
User requesting a rental car return must be logged in.

# Rental listing for user

**FR**
Should be able to listing all rentals for a user.

**BR**
User must be logged in.