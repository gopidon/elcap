import {dropdowns} from './constants';

export function getTaxType(type){
    return dropdowns.notifCategories.find((item) => {
        return item.code === type;
    })
}