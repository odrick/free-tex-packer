function createHTTPQuery(params) {
    let query = params || '';
    if (query && ('string' != typeof query)) {
        query = [];
        for (let key of Object.keys(params)) {
            query.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
        }
        query = query.join('&');
    }
    return query;
}

function createXMLHTTPRequest(url, callback=null, errorCallback=null, dataType="") {

    let xmlhttp = (window.XMLHttpRequest && new XMLHttpRequest()) || null;

    if (xmlhttp) {
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                let data = null, status = 'success';
                if (xmlhttp.status < 400) {
                    if (dataType == 'arraybuffer') {
                        data = xmlhttp.response;
                    }
                    if (dataType == 'xml') {
                        data = xmlhttp.responseXML;
                    }
                    if (!data && xmlhttp.responseText) {
                        data = xmlhttp.responseText;
                    }
                    
                    if(callback) callback(data);
                }
                else {
                    if(errorCallback) errorCallback(`${url} HTTP Error ${xmlhttp.status}: ${xmlhttp.statusText}`);
                }
            }
        };
    }

    return xmlhttp;
}

function send(url, method="GET", params="", callback=null, errorCallback=null, dataType="text") {

    let xmlhttp = createXMLHTTPRequest(url, callback, errorCallback, dataType);
    if (xmlhttp) {
        let query = createHTTPQuery(params);

        if(method == "GET" && query) url += "?" + query;

        xmlhttp.open(method, url, true);

        if (dataType == 'arraybuffer') {
            xmlhttp.responseType = 'arraybuffer';
        }

        if (method == "POST") {
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        }
        xmlhttp.send(method == "GET" ? null : query);
    }
}

function GET(url, params="", callback=null, errorCallback=null, dataType="text") {
    return send(url, "GET", params, callback, errorCallback, dataType);
}

function POST(url, params="", callback=null, errorCallback=null, dataType="text") {
    return send(url, "POST", params, callback, errorCallback, dataType);
}

export {GET, POST};
export default send;