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

const convertStringify = (data) => {
    if (typeOf(data) === "string") return data;
    return JSON.stringify(data);
}

let origin = (window && window.location && window.location.origin) || '';

const defaultOptions = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
}

const modifiedResponse = (response, json?: any) => {

    var modifiedObj = {
        success: response.ok,
        status: response.status,
        statusText: response.statusText ? response.statusText : '',
        data: json || {}
    };

    if (modifiedObj.data.code === 'JSON_PARSING_FAILED') {
        modifiedObj['isJsonParsingFailed'] = true;
    }

    return convertStringify(modifiedObj);

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

const queryStringify = (url, key, value) => {

    if (value) {
        if (typeOf(value) === 'object' || typeOf(value) === 'array') {
            url.searchParams.append(key, convertStringify(value))
        } else {
            url.searchParams.append(key, value)
        }
    }

};

const parseQueryParams = (url , key, value) => {

    if (typeOf(value) === 'array') {

      value.forEach(val => {
        queryStringify(url, key, val)
      });

    } else if (typeOf(value) === 'object') {

      let subObj = value;

      Object.keys(subObj).forEach((key) => {
        queryStringify(url, key, subObj[key]);
      });

    } else {
      url.searchParams.append(key, value);
    }

};

const parseAndUpdateQueryParams = (url, params) => {

  Object
    .keys(params)
    .forEach(key => {
      if (params[key]) {
        parseQueryParams(url, key, params[key])
      }
    });
}

const fetchRequest = (url, options) => {

  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then(readResponseAsJSON)
      .then((jsonStringify) => JSON.parse(jsonStringify))
      .then(validateResponseData)
      .then((result) => resolve(result.data))
      .catch((error) => reject(error))
  });

}

const request = (api = '/', params) => {

  try {

    let body;
    
    api = /^https?:\/\//.test(api) ? api : api;
    
    let url = new URL(origin + api);

    params = params || {};

    const { method = defaultOptions.method, headers = defaultOptions.headers, ...data } = params;

    if ((['GET', 'DELETE'].indexOf(method) > -1)) {
        parseAndUpdateQueryParams(url, data);
    } else { // POST or PUT or PATCH 
        body = convertStringify(data);
    }

    return fetchRequest(url.href, { method, headers, body });

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
