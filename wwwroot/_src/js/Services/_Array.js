export const _Array = {
    /**
     * find array
     * @param ary {any[]} target array
     * @param id {number|string} find value
     * @returns {number} -1(not found), n
     */
    find: function (ary, id) {
        if (ary == null)
            return -1;
        for (let i = 0; i < ary.length; i++) {
            if (ary[i] == id)
                return i;
        }
        return -1;
    },
    /**
     * convert array to string with separator
     * @param ary {any[]} source array
     * @param sep {string} separator, default to ','
     * @returns {string} ex: '1,2,3'
     */
    toStr: function (ary, sep = ",") {
        return ary.join(sep);
    },
    isEmpty: function (ary) {
        return (ary == null || ary.length == 0);
    },
    notEmpty: function (ary) {
        return !_Array.isEmpty(ary);
    },
};
//# sourceMappingURL=_Array.js.map