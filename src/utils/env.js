/**
 * Created by udemy.don on 2/18/17.
 */
const _Environments = {
    production:
    {
        'GCOOL_ENDPOINT': 'https://api.graph.cool/simple/v1/cjcu3p0w61da40198ucdk7eri',
        'GCOOL_FILE_ENDPOINT': 'https://api.graph.cool/file/v1/cjcu3p0w61da40198ucdk7eri',
        'ALG_APP_ID':'TAAW34UQ2L',
        'ALG_SEARCH_ONLY_KEY':'6459a7547021d237d16894089ea5f455'
    },
    dev:
    {
        'GCOOL_ENDPOINT': 'https://api.graph.cool/simple/v1/cjcu3p0w61da40198ucdk7eri',
        'GCOOL_FILE_ENDPOINT': 'https://api.graph.cool/file/v1/cjcu3p0w61da40198ucdk7eri',
        'ALG_APP_ID':'2J074MLKF3',
        'ALG_SEARCH_ONLY_KEY':'4ecd9939100bd71cbfd9790ba23ab4ef'
    }

};

function getEnvironment() {
    // Insert logic here to get the current platform (e.g. staging, production, etc)
    let platform = getPlatform();
    // ...now return the correct environment
    return _Environments[platform];
}

function getPlatform(){
    return process.env.NODE_ENV || `${process.env.NODE_ENV}`;
}

const Environment = getEnvironment();
export default Environment;
