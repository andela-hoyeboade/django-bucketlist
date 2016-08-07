from django.shortcuts import get_object_or_404


class MultipleFieldLookupMixin(object):
    """
    To look up objects with multiple fields as specified in the url conf
    """

    def get_object(self):
        queryset = self.get_queryset()             # Get the base queryset
        queryset = self.filter_queryset(queryset)  # Apply any filter backends
        filter = {}
        for field in self.lookup_fields:
            filter[field] = self.kwargs[field]
        return get_object_or_404(queryset, **filter)  # Lookup the object
