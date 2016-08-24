from django.contrib.auth.models import User
from django.db import models


class Base(models.Model):
    """
    Base model inherited by other models
    """
    name = models.CharField(max_length=200, null=False)
    date_created = models.DateTimeField(
        auto_now_add=True, verbose_name='created_on')
    date_modified = models.DateTimeField(
        auto_now=True, verbose_name='modified_on')

    class Meta:
        abstract = True
        ordering = ['-date_modified']


class BucketList(Base):
    """
    Model for bucketlist
    """
    owner = models.ForeignKey(
        User, related_name='bucketlist', on_delete=models.CASCADE)

    class Meta(Base.Meta):
        db_table = 'bucketlist'

    def __str__(self):
        return self.name


class BucketListItem(Base):
    """
    Model for bucketlist item
    """
    bucketlist = models.ForeignKey(
        BucketList, related_name='items', on_delete=models.CASCADE)
    done = models.BooleanField(default=False)

    class Meta(Base.Meta):
        db_table = 'bucketlistitem'
        ordering = ['done', '-date_modified']

    def __str__(self):
        return self.name
