import axios from "axios";
import { atom, selector, selectorFamily } from "recoil";

export interface MailSchema {
    id: string,
    from: {
        email: string,
        name: string
    },
    date: number,
    subject: string,
    short_description: string,
}

interface MailTags {
    id: string,
    opened: boolean,
    favorite: boolean

}

export const mailsAtom = atom<MailSchema[]>({
    key: "mailAtom",
    default: selector({
        key: "mailAtomSelector",
        get: async () => {

            const res = await axios.get("https://flipkart-email-mock.now.sh");
            return res.data.list;
        }
    })
})

export const mailSelector = selectorFamily({
    key: "mailSelector",
    get: (id) => ({ get }) => {

        const mails = get(mailsAtom);

        return mails.find((item) => item.id === id);
    }
})

export const mailFilterAtom = atom<"read" | "unread" | "favorites">({
    key: "mailFilterAtom",
    default: "unread",
})

export const filteredMailSelector = selector({
    key: "filteredMailSelector",
    get: ({ get }) => {

        const currentfilter = get(mailFilterAtom);
        const mails = get(mailsAtom);
        const mailTags = get(mailTagsAtom);

        return mails.filter((mail) => {

            let currentMailTag = mailTags.find((item) => item.id === mail.id);

            if(currentfilter === "favorites" && currentMailTag?.favorite)
                return mail;

            else if(currentfilter === "read" && currentMailTag?.opened)
                return mail;

            else if(currentfilter === "unread" && !currentMailTag?.opened)
                return mail;

        })

    }
});

export const selectedMailAtom = atom<null | string>({
    key: "selectedMailAtom",
    default: null,
})


export const mailTagsAtom = atom<MailTags[]>({
    key: "mailTagsAtom",
    default: selector({
        key: "mailTagsAtomSelector",
        get: ({ get }) => {

            const mails = get(mailsAtom);

            return mails.map((item) => {
                return {
                    id: item.id,
                    opened: false,
                    favorite: false
                }
            })
        }
    })
});