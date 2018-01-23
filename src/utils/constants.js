/**
 * Created by gopi on 1/12/17.
 */


const dropdowns = {
    actCategories: ['CGST','SGST','IGST'],
    videoCategories: ['All','Registration','Returns','Composition','Input Tax Credit','Transition', 'Invoices','Refunds','Supply','Other'],
    resourceLinkTypes: ['NONE','PDF', "HTML","Navigation Link"],
    notifCategories: [
        {"code":"CGST", "value":"Central Tax"},
        {"code":"CGSTR", "value":"Central Tax (Rate)"},
        {"code":"IGST", "value":"Integrated Tax"},
        {"code":"IGSTR", "value":"Integrated Tax (Rate)"},
        {"code":"UTGST", "value":"Union Territory Tax"},
        {"code":"UTGSTR", "value":"Union Territory Tax (Rate)"},
        {"code":"COMPCESS", "value":"Compensation Cess"},
        {"code":"COMPCESSR", "value":"Compensation Cess (Rate)"}
    ],
    rateScheduleCategories: [
        {"code":"0", "value":"Schedule 0"},
        {"code":"1", "value":"Schedule 1"},
        {"code":"2", "value":"Schedule 2"},
        {"code":"3", "value":"Schedule 3"},
        {"code":"4", "value":"Schedule 4"},
        {"code":"5", "value":"Schedule 5"},
        {"code":"6", "value":"Schedule 6"}
    ],
    servicesRateScheduleCategories: [
        {"code":"0", "value":"Schedule 0"},
        {"code":"1", "value":"Schedule 1"}
    ],
    circularCategories: [
        {"code":"CGST", "value":"Central Tax"},
        {"code":"IGST", "value":"Integrated Tax"},
        {"code":"UTGST", "value":"Union Territory Tax"},
        {"code":"COMPCESS", "value":"Compensation Cess"}
    ],
};



module.exports = {
    dropdowns
};
