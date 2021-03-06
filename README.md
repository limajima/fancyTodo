# Fancy Todo Server
Get your task Done Effectively. This app has : 
* RESTful endpoint for asset's CRUD operation
* JSON formatted response

&nbsp;

## RESTful endpoints
### POST /register

> Post User Register

_Request Body_
```
{
    "username": "Acong",
    "email": "acong@gmail.com",
    "password": "123456"
}
```

_Response (201 - created)_
```
{
    "id": "1",
    "email": "acong@gmail.com"
}
```

_Response (400 - Bad request)_
```
{
    "message": [
        "Please fill the Username",
        "Username minimum 5 characters",
        "Username must be unique",
        "Please fill the Email",
        "Invalid Email Format !",
        "Email must be unique",
        "Please fill the Password",
        "Password at least 5 Characters"
    ]
}
```

### POST /login

> Post User Login

_Request Body_
```
{
    "email": "acong@gmail.com",
    "password": "123456"
}
```

_Response (200 - OK)_
```
{
    "access_token": "<generated by system>",
    "username": "Acong"
}
```

_Response (401 Bad - Unauthorized)_
```
{
    "message": [
        "Email not found, please register first",
        "Invalid Email/password"
    ]
}
```
### GET /todos

> Get all todo list

_Request Header_
```
{
  "access_token": "<your access token>"
}
```


_Request Body_
```
not needed
```

_Response (200 - OK)_
```
[
  {
    "id": 1,
    "title": "Acong's Website",
    "description": "Website Acong",
    "status": "false",
    "due_date":  "2020-03-21T07:15:12.149Z",
    "createdAt": "2020-03-20T07:15:12.149Z",
    "updatedAt": "2020-03-20T07:15:12.149Z",
  },
  {
    "id": 2,
    "title": "Djoko's Visual Code",
    "description": "Djoko Visual Code",
    "status": "false",
    "due_date":  "2020-03-21T07:15:12.149Z",
    "createdAt": "2020-03-20T07:15:12.149Z",
    "updatedAt": "2020-03-20T07:15:12.149Z",
  }
]
```

_Response (500 - Bad Request)_
```
{
  "message": "Internal Server Error"
}
```
---
### POST /todos

> Create new todo

_Request Header_
```
{
  "access_token": "<your access token>"
}
```

_Request Body_
```
{
  "title": "Acong in Phase2",
  "description": "Proceed to the Next Phase",
  "status": "false",
  "due_date": "2020-04-20"
}
```

_Response (201 - Created)_
```
{
  "id": "3",
  "title": "Acong in Phase2",
  "description": "Proceed to the Next Phase",
  "status": "false",
  "due_date": "2020-04-20T07:15:12.149Z",
  "createdAt": "2020-04-19T07:15:12.149Z",
  "updatedAt": "2020-04-19T07:15:12.149Z",
}
```

_Response (400 - Bad Request)_
```
{
  "message": "Due date not valid"
}
```

_Response (500 - Bad Request)_
```
{
  "message": "Internal Server Error"
}
```

### GET /todos/:id

> Get todo by id

_Request Header_
```
{
  "access_token": "<your access token>"
}
```

_Request Params_
```
{
    "id": <integer>
}
```

_Response (200 - OK)_
```
{
  "id": 1,
  "title": "Acong's Website",
  "description": "Website Acong",
  "status": "false",
  "due_date":  "2020-03-21T07:15:12.149Z",
  "createdAt": "2020-03-20T07:15:12.149Z",
  "updatedAt": "2020-03-20T07:15:12.149Z",
}
```
_Response (401 - Unauthorized)_
```
{
  "message": "User not authorized"
}
```
_Response (404 - Not Found)_
```
{
  "message": "Data not found"
}
```
_Response (500 - Bad Request)_
```
{
  "message": "Internal Server Error"
}
```

### PUT /todos/:id

> Edit todo value

_Request Header_
```
{
  "access_token": "<your access token>"
}
```

_Request Params_
```
"id" = <integer>
```
_Request Body_
```
{
  "title": "Belajar Phase3",
  "description": "Belajar React-Native",
  "status": "false",
  "due_date": "2021-02-25",
}
```

_Response (200 - OK)_
```
  {
    "id": "1",
    "title": "Belajar Phase3",
    "description": "Belajar React-Native",
    "status": "false",
    "due_date": "2021-02-25T07:15:12.149Z", 
    "createdAt": "2021-02-04T07:15:12.149Z",
    "updatedAt": "2021-02-04T07:15:12.149Z",
  }
```
_Response (401 - Unauthorized)_
```
{
  "message": "User not authorized"
}
```

_Response (400 - Bad Request)_
```
{
  "message": [
    "Status must be filled",
    "Title can't be empty"
    "Due date not valid"
  ]
}
```
_Response (404 - Bad Request)_
```
{
  "message": "Data not found"
}
```
_Response (500 - Bad Request)_
```
{
  "message": "Internal Server Error"
}
```
---

### PATCH /todos/:id

> Edit todo value

_Request Header_
```
{
  "access_token": "<your access token>"
}
```

_Request Params_
```
"id" = <integer>
```
_Request Body_
```
{
  "status": "true",
}
```

_Response (200 - OK)_
```
  {
    "id": "1",
    "title": "Belajar Phase3",
    "description": "Belajar React-Native",
    "status": "true",
    "due_date": "2021-02-25T07:15:12.149Z", 
    "createdAt": "2021-02-04T07:15:12.149Z",
    "updatedAt": "2021-02-04T07:15:12.149Z",
  }
```

_Response (400 - Bad Request)_
```
{
  "message": "Due date not valid"
}
```
_Response (401 - Unauthorized)_
```
{
  "message": "User not authorized"
}
```
_Response (404 - Bad Request)_
```
{
  "message": "Data not found"
}
```
_Response (500 - Bad Request)_
```
{
  "message": "Internal Server Error"
}
```
---

### DELETE /todos/:id

> Edit todo value

_Request Header_
```
{
  "access_token": "<your access token>"
}
```

_Request Params_
```
"id" = <integer>
```
_Request Body_
```
not needed
```

_Response (200 - OK)_
```
  {
    "message": "Todo success to be deleted"
  }
```
_Response (401 - Unauthorized)_
```
{
  "message": "User not authorized"
}
```

_Response (404 - Bad Request)_
```
{
  "message": "Data not found"
}
```
_Response (500 - Bad Request)_
```
{
  "message": "Internal Server Error"
}
```
### GET /todos/weather

> Get weather from third API

_Request Headers_
```
{
  "access_token": "<user access token>"
}
```

_Response (200 - OK)_
```
{
  "name": "Jakarta",
  "temp": 26.44,
  "temp_max": 27.22,
  "temp_min": 26,
  "feels_like": 26.44,
  "description": "moderate rain",
  "visibility": 6000,
  "humidity": 89
}
```
_Response (404 - Not Found)_
```
{
  "message": "Data not found"
}
```


