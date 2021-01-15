export class UtilitiesCls {
    constructor() { }
    getServiceFilterQuery(facet: any) {
        let returnVal = '';
        switch (facet) {
            case 'Admin Boundaries':
                returnVal = '*Admin_Bounds*';
                break;
            case 'Bioscience':
                returnVal = '*Bio*';
                break;
            case 'Cadastral':
                returnVal = '*Cadastral*';
                break;
            case 'Imagery':
                returnVal = 'image';
                break;
            case 'Elevation':
                returnVal = '*LiDAR*';
                break;
            default:
                break;
        }
        return returnVal;
    }

    getMapServiceUrl(record: any) {
        return (record['url.mapserver_ss']
            ? record['url.mapserver_ss'][0]
            : record['url.imageserver_ss']
                ? record['url.imageserver_ss'][0]
                : record['url.wms_ss']
                    ? record['url.wms_ss'][0]
                    : record['url.wfs_ss']
                        ? record['url.wfs_ss'][0]
                        : record['url.kml_ss']
                            ? record['url.kml_ss'][0]
                            : record['sys.src.item.url_s']
                                ? record['sys.src.item.url_s'].includes('arcgis')
                                    ? record['sys.src.item.url_s']
                                    : ''
                                : '')
            .replace('arcgis/services', 'arcgis/rest/services')
            .split('/WMSServer?')[0];
    }

    sourceLookup(source: any) {
        let returnVal = source;
        switch (source) {
            case 'Geographic Information Services (GIS) Unit, Oregon Department of Transportation (ODOT)':
            case 'Geographic Information Services (GIS) Unit, Oregon Department of Transportation (ODOT).':
                returnVal = 'OR Dept. of Transportation';
                break;
            case 'Bureau of Land Management, Oregon State Office':
            case 'Oregon State Office, BLM':
                returnVal = 'BLM - OR State Office';
                break;
            case 'Oregon Department of Forestry GIS':
                returnVal = 'OR Dept of Forestry';
                break;
            case 'REQUIRED: The organization responsible for the metadata information.':
                returnVal = '';
                break;
            default:
                break;
        }
        return returnVal;
    }

    browserCheck() {
        let agent = {
            browser:
            {
                name: null, version: null, v: null, userAgent: null, app: null, os: null
            }, mobile: false, pointlock: false
        };

        let nVer = navigator.appVersion;
        let nAgt = navigator.userAgent;
        let browserName = navigator.appName;
        let fullVersion = '' + parseFloat(navigator.appVersion);
        let majorVersion = parseInt(navigator.appVersion, 10);
        let nameOffset: number, verOffset: number, ix: number;
        agent.pointlock = 'pointerLockElement' in document ||
            'mozPointerLockElement' in document ||
            'webkitPointerLockElement' in document;

        // In Opera, the true version is after "Opera" or after "Version"
        if ((verOffset = nAgt.indexOf('Opera')) !== -1) {
            browserName = 'Opera';
            fullVersion = nAgt.substring(verOffset + 6);
            if ((verOffset = nAgt.indexOf('Version')) !== -1) {
                fullVersion = nAgt.substring(verOffset + 8);
            }
        } else if ((verOffset = nAgt.indexOf('MSIE')) !== -1) {
            // In MSIE, the true version is after "MSIE" in userAgent
            browserName = 'Microsoft Internet Explorer';
            fullVersion = nAgt.substring(verOffset + 5);
        } else if ((verOffset = nAgt.indexOf('Chrome')) !== -1) {
            // In Chrome, the true version is after "Chrome"
            browserName = 'Chrome';
            fullVersion = nAgt.substring(verOffset + 7);
        } else if ((verOffset = nAgt.indexOf('Safari')) !== -1) {
            // In Safari, the true version is after "Safari" or after "Version"
            browserName = 'Safari';
            fullVersion = nAgt.substring(verOffset + 7);
            if ((verOffset = nAgt.indexOf('Version')) !== -1) {
                fullVersion = nAgt.substring(verOffset + 8);
            }
        } else if ((verOffset = nAgt.indexOf('Firefox')) !== -1) {
            // In Firefox, the true version is after "Firefox"
            browserName = 'Firefox';
            fullVersion = nAgt.substring(verOffset + 8);
        } else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
            (verOffset = nAgt.lastIndexOf('/'))) {
            // In most other browsers, "name/version" is at the end of userAgent
            browserName = nAgt.substring(nameOffset, verOffset);
            fullVersion = nAgt.substring(verOffset + 1);
            if (browserName.toLowerCase() == browserName.toUpperCase()) {
                browserName = navigator.appName;
            }
        }
        // trim the fullVersion string at semicolon/space if present
        if ((ix = fullVersion.indexOf(';')) != -1) {
            fullVersion = fullVersion.substring(0, ix);
        }
        if ((ix = fullVersion.indexOf(' ')) != -1) {
            fullVersion = fullVersion.substring(0, ix);
        }

        majorVersion = parseInt('' + fullVersion, 10);
        if (isNaN(majorVersion)) {
            fullVersion = '' + parseFloat(navigator.appVersion);
            majorVersion = parseInt(navigator.appVersion, 10);
        }
        agent.browser.name = browserName;
        agent.browser.version = fullVersion;
        agent.browser.v = majorVersion;
        agent.browser.app = navigator.appName;
        agent.browser.userAgent = navigator.userAgent;
        let OSName = 'Unknown OS';
        if (navigator.appVersion.indexOf('Win') !== -1) { OSName = 'Windows'; }
        if (navigator.appVersion.indexOf('Mac') !== -1) { OSName = 'MacOS'; }
        if (navigator.appVersion.indexOf('X11') !== -1) { OSName = 'UNIX'; }
        if (navigator.appVersion.indexOf('Linux') !== -1) { OSName = 'Linux'; }

        agent.browser.os = OSName;
        agent.mobile = (typeof window.orientation !== 'undefined') || (navigator.userAgent.indexOf('IEMobile') !== -1);
        return agent;
    }
}


