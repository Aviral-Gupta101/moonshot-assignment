import { atom } from "recoil"

export interface LineChartData {

    timestamp: number,
    value: number,
    feature: string,
    formatedDate: string

}

export const applyFilterStateChangeAtom = atom<boolean>({
    key: "applyFilterStateChangeAtom",
    default: false
})

export const lineChartDataLoadingAtom = atom<boolean>({
    key: "barChartDataAtom",
    default: false
})

export const lineChartDataAtom = atom<LineChartData[]>({
    key: "lineChartDataAtom",
    default: []
})