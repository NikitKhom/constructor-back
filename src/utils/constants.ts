const SERVER_ERROR = 500;
const BAD_REQUEST = 400;
const OK = 200;
const CREATED = 201;
const NOT_FOUND_ERROR = 404;
const CONFLICT = 409;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const SALT_ROUNDS = 10;
const REGEXP_LINK = /https?:\/\/(?:www\.)?[0-9a-zA-Z-]+\.[a-zA-Z]+(?:[-.\w~,:/?#[\]@!$&'()*+;=]*)#?/;

export {
  SALT_ROUNDS,
  CONFLICT,
  SERVER_ERROR,
  BAD_REQUEST,
  OK,
  CREATED,
  NOT_FOUND_ERROR,
  UNAUTHORIZED,
  FORBIDDEN,
  REGEXP_LINK,
};