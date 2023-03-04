import { SimpleDialog } from "@/components"

let dialogRef: SimpleDialog | undefined = undefined

function setDialog(ref: SimpleDialog) {
    dialogRef = ref
}

function getDialog() {
    return dialogRef
}

export default {
    setDialog,
    getDialog,
}