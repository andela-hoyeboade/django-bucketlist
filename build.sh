python djangobucketlist/manage.py makemigrations
python djangobucketlist/manage.py migrate
gunicorn django-bucketlist.wsgi --pythonpath=djangobucketlist --log-file=-
