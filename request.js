const typeOf = (obj) => {
    const toString = Object.prototype.toString;
    const map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object',
    };
    return map[toString.call(obj)];
};

const convertJsonToString = (data) => {
    if (typeOf(data) === "string") return data;
    return JSON.stringify(data);
}

const convertStringToJson = (data) => {
    if (typeOf(data) !== "string") return null;

    try {
        return JSON.parse(data);
    } catch (err) {
        return null;
    }
}

let origin = (window && window.location && window.location.origin) || '';

const defaultOptions = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
}

const modifiedResponse = (response, json) => {

    var modifiedObj = {
        success: response.ok,
        status: response.status,
        statusText: response.statusText ? response.statusText : '',
        data: json || {}
    };

    if (modifiedObj.data.code === 'JSON_PARSING_FAILED') {
        modifiedObj['isJsonParsingFailed'] = true;
    }

    return convertJsonToString(modifiedObj);

}

const validateResponseData = (response) => {

  if (!response.success || response.isJsonParsingFailed) {
    return Promise.reject(response);
  }

  return response;
}

const readResponseAsJSON = (response) => {

    return response.json()
        .then((json) => {
          return modifiedResponse(response, json);  // Modify response to include status ok, success, and status text
        }).catch((err) => {

            const error = {
                code: "JSON_PARSING_FAILED",
                message: "Response json parsing failed!"
            }

            return modifiedResponse(response, error);
    });
}

const queryStringify = (urlInstance, key, value) => {
    if (typeOf(value) === 'object' || typeOf(value) === 'array') {
        urlInstance.searchParams.append(key, convertJsonToString(value))
    } else {
        urlInstance.searchParams.append(key, value)
    }
};

const parseQueryParams = (urlInstance, key, value) => {

    if (typeOf(value) === 'array') {

      value.forEach(val => {
        queryStringify(urlInstance, key, val)
      });

    } else if (typeOf(value) === 'object') {

      Object.keys(value).forEach((key) => {
        queryStringify(urlInstance, key, value[key]);
      });

    } else {
        queryStringify(urlInstance, key, value);
    }

};

const parseAndUpdateQueryParams = (urlInstance, params) => {
    const keys = Object.keys(params || {});
    
    keys.forEach(key => {
        parseQueryParams(urlInstance, key, params[key]);
    });
}

const fetchRequest = (url, options) => {

  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then(readResponseAsJSON)
      .then((jsonStringify) => convertStringToJson(jsonStringify))
      .then(validateResponseData)
      .then((result) => resolve(result.data))
      .catch((error) => reject(error))
  });

}

const request = (url = '/', params) => {

  try {

    let body;
    
    url = /^https?:\/\//.test(url) ? url : `${origin}${url}`;
    
    const urlInstance = new URL(url);

    params = params || {};

    const { method = defaultOptions.method, headers = defaultOptions.headers, ...restParams } = params;

    if ((['GET', 'DELETE'].indexOf(method) > -1)) {
        parseAndUpdateQueryParams(urlInstance, restParams);
    } else { // POST or PUT or PATCH 
        body = convertJsonToString(restParams);
    }

    return fetchRequest(urlInstance.href, { method, headers, body });

  } catch (err) {
    throw err;
  }

}

export default {
  default: request,
  get: (url, params) => request(url, { method: 'GET', ...params}),
  post: (url, params) => request(url, { method: 'POST', ...params}),
  put: (url, params) => request(url, { method: 'PUT', ...params}),
  patch: (url, params) => request(url, { method: 'PATCH', ...params}),
  delete: (url, params) => request(url, { method: 'DELETE', ...params})
};
