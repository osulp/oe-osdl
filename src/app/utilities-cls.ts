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
}


