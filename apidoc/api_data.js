define({ "api": [
  {
    "type": "get",
    "url": "/users",
    "title": "Request User information",
    "name": "GetUsers",
    "group": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>HTTP status code from API.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Message from API.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/services/training/routes/common.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/users/make-trainer",
    "title": "make user Trainer",
    "name": "Make_trainer",
    "group": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>HTTP status code from API.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Message from API.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/services/training/routes/common.js",
    "groupTitle": "User"
  },
  {
    "type": "GET",
    "url": "/users/:id",
    "title": "find User By ID",
    "name": "findById",
    "group": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>HTTP status code from API.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Message from API.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/services/training/routes/common.js",
    "groupTitle": "User"
  },
  {
    "type": "POST",
    "url": "/users/:id",
    "title": "update user",
    "name": "findById",
    "group": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>HTTP status code from API.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Message from API.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/services/training/routes/common.js",
    "groupTitle": "User"
  },
  {
    "type": "POST",
    "url": "/users/verify-phone",
    "title": "make user Trainer",
    "name": "verify_phone",
    "group": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>HTTP status code from API.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Message from API.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/services/training/routes/common.js",
    "groupTitle": "User"
  },
  {
    "type": "GET",
    "url": "/users/verify-phone",
    "title": "Varify User Phone",
    "name": "verify_phone",
    "group": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>HTTP status code from API.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Message from API.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/services/training/routes/common.js",
    "groupTitle": "User"
  }
] });
