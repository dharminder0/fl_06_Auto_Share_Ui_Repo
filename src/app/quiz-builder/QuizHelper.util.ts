export class QuizHelperUtil {

    /**
     * *Returns the file type i.e `video` or `audio`
     * @param url : URL
     */
    public static getFileType(url: string): string {
        try {
            var splitArray = url.split(".");
            var fileType = splitArray[splitArray.length - 1];
            let isImage: boolean = fileType === "jpg" ||
                fileType === "jpeg" ||
                fileType === "tiff" ||
                fileType === "jpg" ||
                fileType === "gif" ||
                fileType === "" ||
                fileType === "png";
            let isDoc: boolean = fileType === "text" ||
                fileType === "doc" ||
                fileType === "docx" ||
                fileType === "pdf" ||
                fileType === "ppt" ||
                fileType === "pttx"


            if (isImage) {
                return "image";
            } else if (isDoc) {
                return "pdf"
            }
            else {
                return "video";
            }
        } catch (e) {
            throw new Error("Exception in QuizHelperUtil.getFileType: Message==>   " + e)
        }
    }


    /**
     * * Used only for cloudinary upload widget. 
     * @param url : Url
     * @param coordinates  : Cordinate and its faces
     */
    public static applyCoorniateFacesInUrl(url, coordinates): any {
        let finalUrl = ""
        var coordinate = "";
        if (
            coordinates &&
            coordinates.faces
        ) {
            var cloudCoordinate = coordinates.faces;
            coordinate = `x_${cloudCoordinate[0][0]},y_${
                cloudCoordinate[0][1]
                },w_${cloudCoordinate[0][2]},h_${cloudCoordinate[0][3]},c_crop`;
        }
        if (url.match("upload")) {
            var index = url.match("upload").index;
            finalUrl =
                url.slice(0, index + 6) +
                "/" +
                coordinate +
                url.slice(index + 6 + Math.abs(0));

        }
        return finalUrl.length > 0 ? finalUrl : url
    }
}