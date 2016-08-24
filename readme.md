<snippet>
<content>
# Django Bucketlist Application
[![Build Status](https://travis-ci.org/andela-hoyeboade/django-bucketlist.svg?branch=develop)](https://travis-ci.org/andela-hoyeboade/django-bucketlist) [![Coverage Status](https://coveralls.io/repos/github/andela-hoyeboade/django-bucketlist/badge.svg)](https://coveralls.io/github/andela-hoyeboade/django-bucketlist)


## Description
This is a Python Checkpoint3 project for D0B fellows in Andela. It's a Django application designed to manage bucketlists. A bucket list is a list of things that one has not done before but wants to do before dying. Users can register, login and can create or manage bucketlists

##Technology used
  * Django
  * Djangorestframework
  * ReactJS
  * Django swagger

##API Documentation
The API documentation is available <a href="https://mybucketlists.herokuapp.com/api/v1/docs">here</a>

## Installation
1. Clone the repo
`git clone https://github.com/andela-hoyeboade/django-bucketlist.git/` and navigate to the project directory

2. Create and activate a virtual environment e.g `mkvirtualenv venv`

3. Install dependencies
```pip install -r requirements.txt```

4. From the project root directory, run the app
  * Set up the database
      - Create a postgres database using pgadmin or any other possible methods.
      -  navigate to djangobucketlist/django-bucketlist/settings/development.py file, then update the database settings to hold your database name, your postgres user, password and any other neccessary information
  * Make migrations.<br>
      - Run `cd djangobucketlist` and `python manage.py makemigrations` to create the models for the app.
      - After making migrations, run `python manage.py migrate` to create necessary tables in the database.
  * Run `cd djangobucketlist` and `python manage.py runserver` to get the app running

## Functionality, Endpoints and Accessiblity
  <table>
  <tr>
  <th> Functionality </th>
  <th> Endpoint</th>
  <th> Public Access</th>
  </tr>
  <tr>
  <td>Logs a user in</td>
  <td>POST /auth/login</td>
  <td>True</td>
  </tr>
  <tr>
   <td>Register a user</td>
   <td>POST /auth/register</td>
   <td> True</td>
  </tr>

  <tr>
  <td>Create a new bucket list</td>
  <td>POST /bucketlists/ </td>
  <td>False</td>
  </tr>

  <tr>
  <td>List all the created bucket lists</td>
  <td>GET /bucketlists/ </td>
  <td>False</td>
  </tr>

  <tr>
  <td>Get single bucket list</td>
  <td>GET /bucketlists/{id} </td>
  <td>False</td>
  </tr>

  <tr>
  <td>Update this bucket list</td>
  <td>PUT /bucketlists/{id} </td>
  <td>False</td>
  </tr>

  <tr>
  <td>Delete this single bucket list</td>
  <td>DELETE /bucketlists/{id} </td>
  <td>False</td>
  </tr>

  <tr>
  <td>Create new item in this bucket list</td>
  <td>POST /bucketlists/{id}/items/ </td>
  <td>False</td>
  </tr>

  <tr>
  <td>Update a bucketlist item </td>
  <td>PUT /bucketlists/{id}/items/{item_id} </td>
  <td>False</td>
  </tr>

  <tr>
  <td>Delete this item in this bucket list</td>
  <td>DELETE /bucketlists/{id}/items/{item_id} </td>
  <td>False</td>
  </tr>
  </table>

## Usage
The app can be used by visiting the site https://mybucketlists.herokuapp.com, creating an account and making use of the different functionalities provided on the dashboard page

## Running tests
1. Navigate to the project direcory
2. cd into djangobucketlist and run python manage.py test

##Project Demo
Click <a href='https://www.youtube.com/watch?v=l6wMlBOgTVM'>here </a> to view the project demo

## References
http://docs.djangoproject.com/ <br />
https://docs.python.org <br />
http://courses.reactjsprogram.com/ <br/>

## Author
Hassan Oyeboade

</content>
</snippet>
