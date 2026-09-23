# Offset/limit list pagination

Collection endpoints (Jobs, Customers, admin Organizations, and similar) use **offset/limit** or page/pageSize query params and return pagination `meta` (including totals where useful). Filters are query params (for example Job Status, Assignee, Customer phone search).

We rejected cursor pagination as the MVP default (extra client complexity without a proven hot list) and rejected unpaginated “return everything” boards (admin org list and Customer search will grow). A specific list may move to cursors later if measurement demands it.
