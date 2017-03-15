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
            case 'Elevation':
                returnVal = '*LiDAR*';
                break;
            default:
                break;
        }
        return returnVal;
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


