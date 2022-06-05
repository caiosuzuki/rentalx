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
Should be able to list all car specifications.
Should be able to list all cars.

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

**RF**
Should be able to register a car rental.

**BR**
The rental must have a duration of at least 24 hours.
Should not be able to register a rental if there's an on-going rental for the same user.
Should not be able to register a rental if there's an on-going rental for the same car.
