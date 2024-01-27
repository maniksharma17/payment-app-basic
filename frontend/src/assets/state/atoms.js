import { atom, selector } from 'recoil'

export const usernameAtom = atom({
    key: "usernameAtom",
    default: ""
})

export const firstAtom = atom({
    key: "firstAtom",
    default: ""
})

export const lastAtom = atom({
    key: "lastAtom",
    default: ""
})

export const passwordAtom = atom({
    key: "passwordAtom",
    default: ""
})

export const tokenAtom = atom({
    key: "tokenAtom",
    default: ""
})

export const userlistAtom = atom({
    key: "userlistAtom",
    default: []
})

export const paymentUserInfoAtom = atom({
    key: "paymentUserInfoAtom",
    default: {
        username: "",
        firstName: "",
        lastName: "",
        password: ""
    }
})
