/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Router, Request, Response, NextFunction,
} from 'express';

import axios from 'axios';

export const PullContentUpdateMiddleware = async (
  request,
  response,
  next: NextFunction,
) => {
  const { masterRef, documents } = request.body;
  const updatedDocument = documents[0];

  request.contentUpdate = {
    masterRef,
    document: updatedDocument,
  };
  next();
};

export const NetworkRequestContentUpdateMiddleware = async (
  request,
  response: Response,
  next: NextFunction,
) => {
  const URL = process.env.PRISMIC_ENDPOINT;

  const networkResponse = await axios.get(URL, {
    params: { ref: request.contentUpdate.masterRef, q: `[[:d = at(document.id, "${request.contentUpdate.document}")]]` },
  }).catch();

  const result = networkResponse.data.results[0].data;

  console.log(result);

  request.body.image = result.image.url;
  request.body.quote = result.quote[0].text;

  next();
};

export const a = async (request, response, next) => {
  next();
};
