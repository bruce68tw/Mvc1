export default class EditModeEstr {
    /**
     * default mode
     */
    static Base = 'Base';
    /**
     * user role mode
     */
    static UR = 'UR';
    /**
     * 1對1
     */
    static One = 'One';
}

//ex: _Fun.FunC -> FunEstr.Create
//for mapping to backend
export default class FunEstr {
    // 變數宣告 var 改用 let, const, 這裡用 static readonly 模擬常數
    // 雖然規則 4 是針對 function 內部的 var，但在 class 內將這些視為常數屬性更合理。
    // 如果必須是靜態屬性，則應使用 static readonly。
    // 由於原始是物件字面量，我將其改為 static readonly 屬性以維持外部存取方式 FunEstr.Create。
    static Create = 'C';
    static Read = 'R';
    static Update = 'U';
    static Delete = 'D';
    static View = 'V';
}

//輸入欄位種類, 對應 Base InputTypeEstr 
export default class InputTypeEstr {
    // 原始物件字面量中的常數值被轉換為 static readonly 屬性，以符合 class 語法
    // 且保持 InputTypeEstr.Check 這樣的外部存取方式。
    static Check = "check";
    static Date = "date";
    static DateTime = "dt";
    static Decimal = "dec";
    static File = "file";
    static Hide = "hide";
    static Html = "html";
    static Integer = "int";
    static Link = "link";
    static Modal = "modal";
    static Password = "pwd";
    static Radio = "radio";
    static Read = "read";
    static Select = "select";
    static Sort = "sort";
    static Text = "text";
    static Textarea = "textarea";
}

//內容為mouse事件名稱
export default class MouseEstr {
    // 原始物件字面量中的常數值被轉換為 static readonly 屬性，以符合 class 語法
    // 且保持 MouseEstr.RightMenu 這樣的外部存取方式。
    // 使用 as const 以避免 event 警示 !!
    static RightMenu = 'contextmenu';
    static MouseDown = 'mousedown';
    static MouseUp = 'mouseup';
    static MouseMove = 'mousemove';
    static MouseEnter = 'mouseenter';
    static MouseLeave = 'mouseleave';
    static DragStart = 'dragstart';
    static DragEnd = 'dragend';
    static DragMove = 'dragmove';
    static DragOver = 'dragover';
    static DragEnter = 'dragenter';
    static DragLeave = 'dragleave';
    static Drop = 'drop';
}

//flow node type enum
export default class NodeTypeEstr {
    // 原始物件字面量中的常數值被轉換為 static readonly 屬性，以符合 class 語法
    // 且保持 NodeTypeEstr.Start 這樣的外部存取方式。
    static Start = 'S'; //startNode
    static End = 'E'; //endNode
    static Node = 'N'; //normal node
}

export {};

export {};

export default class EditDto {
    edits;
    divEdit;
    updName;
    /**
     * initial jquery datatables, 參數參考前面的建構子
     * @param edits {array} EditDto array, 不可空白
     * @param divEdit {string} div edit id, 不可空白
     * @param updName {string} update name, default by system
     */
    constructor(edits, divEdit, updName) {
        this.edits = edits;
        this.divEdit = divEdit; //default _me.divEdit
        this.updName = updName; //default by system
    }
}

export {};

export {};

export {};

export {};

import _Edit from './_Edit';
import _iDate from './_iDate';
import _Valid from './_Valid';
import _Obj from './_Obj';
import _iHtml from './_iHtml';
import _Array from './_Array';
import _Str from './_Str';
import _Tool from './_Tool';
import _Fun from './_Fun';
import _Json from './_Json';
import _Ajax from './_Ajax';
import _Prog from './_Prog';
import _iText from './_iText';
import FunEstr from '../Enums/FunEstr';
import EditDto from '../Models/EditDto';
import EditOne from './EditOne';
export default class CrudE {
    _nowFun;
    _Edits;
    _multiEdit;
    _nowEditNo;
    _Edit0;
    constructor(edits) {
        this._nowFun = '';
        this._Edits = edits;
        this._multiEdit = false;
        this._nowEditNo = 0;
        _me.crudE = this;
        if (edits && edits[0] instanceof EditDto) {
            this._multiEdit = true;
            _me.hasEdit = true;
            for (let i = 0; i < edits.length; i++) {
                const dto = edits[i];
                this._initEdit0(dto.edits);
            }
            this.mEditSetEditNo(0);
        }
        else {
            const divEdit = $('#divEdit');
            _me.hasEdit = (divEdit.length > 0 && divEdit.find('form').length > 0);
            _me.divEdit = divEdit;
            if (_me.hasEdit) {
                if (edits == null || edits.length == 0) {
                    edits = [new EditOne()];
                }
                this._initEdit0(edits);
                _me.edit0 = edits[0];
                _me.eform0 = _me.edit0.eform;
                for (let i = 1; i < edits.length; i++) {
                    if (edits[i] instanceof EditOne) {
                        edits[i].setIs1to1();
                    }
                }
            }
        }
        this._Edit0 = _me.edit0;
    }
    getEditByNo(editNo) {
        return this._Edits[editNo];
    }
    viewFileByEditNo(editNo, table, fid) {
        this._Edits[editNo].onViewFile(table, fid);
    }
    setGlobal() {
        _me.crudE = this;
        _me.edit0 = this._Edit0;
        _me.eform0 = _me.edit0.eform;
    }
    _initEdit0(edits) {
        let edit0 = edits[0];
        if (edit0 == null) {
            edit0 = new EditOne();
            edits[0] = edit0;
        }
        const childs = _Edit.Childs;
        edit0[childs] = [];
        for (let i = 1; i < edits.length; i++) {
            edit0[childs][i - 1] = edits[i];
        }
        this._initForm(edit0);
    }
    _initForm(edit) {
        if (edit.eform == null)
            return;
        _iDate.init(edit.eform);
        edit.validator = _Valid.init(edit.eform);
        const childLen = this._EditGetChildLen(edit);
        for (let i = 0; i < childLen; i++) {
            this._initForm(this._EditGetChild(edit, i));
        }
    }
    mEditGetDivEdit() {
        return this._multiEdit
            ? this._Edits[this._nowEditNo].divEdit
            : _me.divEdit;
    }
    mEditSetEditNo(editNo) {
        if (this._multiEdit) {
            this._nowEditNo = editNo;
            const dto = this._Edits[editNo];
            _me.divEdit = dto.divEdit;
            _me.edit0 = dto.edits[0];
            _me.eform0 = _me.edit0.eform;
        }
    }
    mEditGetEditNo() {
        return this._nowEditNo;
    }
    loadJson(json) {
        this._loadJson2(_me.edit0, json);
    }
    _loadJson2(edit, json) {
        const rows = _Edit.jsonGetRows(json);
        if (_Edit.isEditOne(edit)) {
            edit.loadRow(_Array.isEmpty(rows) ? null : rows[0]);
            edit.dataJson = json;
        }
        else {
            edit.loadRowsBySys(rows);
        }
        const childLen = this._EditGetChildLen(edit);
        for (let i = 0; i < childLen; i++) {
            const edit2 = this._EditGetChild(edit, i);
            const json2 = _Edit.getChildJson(json, i);
            this._loadJson2(edit2, json2);
        }
    }
    afterOpen(fun, json) {
        if (_me.fnAfterOpenEdit) {
            _me.fnAfterOpenEdit(fun, json);
        }
    }
    setEditStatus(fun) {
        this._nowFun = fun;
        const box = this.mEditGetDivEdit();
        const items = box.find('[data-edit]');
        _Obj.setEdit(items, false);
        if (fun == FunEstr.View) {
            _Obj.setEdit(box.find('#btnToRead'), true);
            _iHtml.setEdits(box, '', false);
        }
        else if (fun == FunEstr.Create) {
            _Obj.setEdit(items.filter('button'), true);
            const dataEdit = '[data-edit=""],[data-edit*=C]';
            _Obj.setEdit(items.filter(dataEdit), true);
            _iHtml.setEdits(box, '', true);
            _iHtml.setEdits(box, dataEdit, false);
        }
        else if (fun == FunEstr.Update) {
            _Obj.setEdit(items.filter('button'), true);
            const dataEdit = '[data-edit=""],[data-edit*=U]';
            _Obj.setEdit(items.filter(dataEdit), true);
            _iHtml.setEdits(box, '', true);
            _iHtml.setEdits(box, dataEdit, false);
        }
        box.find('span.error').remove();
    }
    _hasFile() {
        const edit = _me.edit0;
        if (edit.hasFile)
            return true;
        const childLen = this._EditGetChildLen(edit);
        for (let i = 0; i < childLen; i++) {
            const edit2 = this._EditGetChild(edit, i);
            if (edit2.hasFile)
                return true;
        }
        return false;
    }
    _getUpdJson(formData) {
        const edit0 = _me.edit0;
        const key = edit0.getKey();
        let fileJson = {};
        const dataJson = {};
        const levelStr = '0';
        if (edit0.hasFile) {
            fileJson = edit0.dataAddFiles(levelStr, formData);
        }
        this._getUpdJson2(edit0, key, levelStr, formData, fileJson, dataJson);
        let hasData = (!_Json.isEmpty(dataJson));
        if (!_Json.isEmpty(fileJson)) {
            hasData = true;
            dataJson[_Edit.FileJson] = fileJson;
        }
        if (!hasData)
            return null;
        _Json.removeNull(dataJson);
        return dataJson;
    }
    _getUpdJson2(edit, key, levelStr, formData, fileJson, dataJson) {
        if (edit.hasFile) {
            const fileJson2 = edit.dataAddFiles(levelStr, formData);
            _Json.copy(fileJson2, fileJson);
        }
        const isOne = _Edit.isEditOne(edit);
        const json = isOne
            ? edit.getUpdRow(key)
            : edit.getUpdJsonBySys(key);
        if (_Json.isEmpty(json))
            return false;
        if (isOne) {
            dataJson[_Edit.Rows] = [json];
        }
        else {
            _Json.copy(json, dataJson);
        }
        const childLen = this._EditGetChildLen(edit);
        if (childLen == 0)
            return false;
        dataJson[_Edit.Childs] = [];
        const childs = dataJson[_Edit.Childs];
        let hasChild = false;
        for (let i = 0; i < childLen; i++) {
            const edit2 = this._EditGetChild(edit, i);
            const key2 = (_Edit.isEditOne(edit2)) ? edit2.getKey() : key;
            childs[i] = {};
            if (this._getUpdJson2(edit2, key2, levelStr + i, formData, fileJson, childs[i])) {
                hasChild = true;
            }
        }
        return hasChild;
    }
    validAll() {
        const edit = _me.edit0;
        if (_Str.notEmpty(edit.systemError)) {
            _Tool.msg(edit.systemError);
            return false;
        }
        if (!edit.eform.valid())
            return false;
        const childLen = this._EditGetChildLen(edit);
        for (let i = 0; i < childLen; i++) {
            const edit2 = this._EditGetChild(edit, i);
            if (_Str.notEmpty(edit2.systemError)) {
                _Tool.msg(edit2.systemError);
                return false;
            }
            if (!edit2.valid())
                return false;
        }
        return true;
    }
    afterSave(data) {
        if (_Fun.hasValue(_me.edit0.fnAfterSave)) {
            _me.edit0.fnAfterSave();
        }
        if (data.Value === '0') {
            _Tool.msg(_BR.SaveNone);
            return;
        }
        _Tool.alert(_BR.SaveOk + '(' + data.Value + ')');
        if (_me.crudR) {
            _me.crudR.dt.reload();
            _me.crudR.toReadMode();
        }
    }
    _afterSaveDraft(data) {
        if (data.Value === '0') {
            _Tool.msg(_BR.SaveNone);
            return;
        }
        _Tool.alert(_BR.SaveOk);
        if (_me.crudR) {
            _me.crudR.toReadMode();
        }
    }
    _resetForm(edit, init) {
        edit.reset(init);
        const childLen = this._EditGetChildLen(edit);
        for (let i = 0; i < childLen; i++) {
            const edit2 = this._EditGetChild(edit, i);
            if (_Edit.isEditOne(edit2)) {
                edit2.reset(init);
            }
            else {
                edit2.reset();
            }
        }
    }
    isEditMode() {
        return this._nowFun !== FunEstr.View;
    }
    async _getJsonAndEditA(fun, key) {
        if (_me.fnGetJsonAndEditA) {
            return await _me.fnGetJsonAndEditA(fun, key);
        }
        const me = this;
        const data = { key: key };
        if (this._multiEdit) {
            data.editNo = this._nowEditNo;
        }
        const act = (fun == FunEstr.Update) ? 'GetUpdJson' :
            (fun == FunEstr.Create) ? 'GetSignJson' :
                'GetViewJson';
        await _Ajax.getJsonA(act, data, function (json) {
            me.loadJsonAndEdit(json, fun);
        });
        return true;
    }
    loadJsonAndEdit(json, fun) {
        this.loadJson(json);
        this.setEditStatus(fun);
        this.afterOpen(fun, json);
        _me.crudR.toEditMode(fun);
    }
    _EditGetChild(edit, childIdx) {
        return edit[_Edit.Childs][childIdx];
    }
    _EditGetChildLen(edit) {
        const fid = _Edit.Childs;
        return (edit[fid] == null) ? 0 : edit[fid].length;
    }
    editToNew() {
        const fun = FunEstr.Create;
        _Prog.setPath(fun);
        this.setEditStatus(fun);
        const edit = _me.edit0;
        edit.resetKey();
        const childLen = this._EditGetChildLen(edit);
        for (let i = 0; i < childLen; i++) {
            const edit2 = this._EditGetChild(edit, i);
            edit2.rowsToNew();
        }
    }
    dataSetFileJson(data, fileJson) {
        if (_Json.isEmpty(fileJson))
            return;
        const fid = _Edit.FileJson;
        if (data.has(fid)) {
            const json = data.get(fid);
            fileJson = _Json.copy(fileJson, json);
        }
        data.set(fid, fileJson);
    }
    onCreate() {
        const fun = FunEstr.Create;
        this._resetForm(_me.edit0, true);
        this.setEditStatus(fun);
        this.afterOpen(fun, null);
    }
    async onUpdateA(key) {
        return await this._getJsonAndEditA(FunEstr.Update, key);
    }
    async onViewA(key) {
        return await this._getJsonAndEditA(FunEstr.View, key);
    }
    async onSignA(key) {
        return await this._getJsonAndEditA(FunEstr.Create, key);
    }
    async onCopyA(key) {
        if (await this._getJsonAndEditA(FunEstr.View, key)) {
            this.editToNew();
        }
    }
    onOpenModal(title, fid, required, maxLen) {
        const tr = _Fun.getMe().closest('tr');
        _Tool.showArea(title, _iText.get(fid, tr), this.isEditMode(), function (result) {
            _iText.set(fid, result, tr);
        });
    }
    async onSaveA() {
        if (!this.validAll()) {
            _Tool.alert(_BR.InputWrong);
            return;
        }
        if (_Fun.hasValue(_me.fnWhenSave)) {
            const error = _me.fnWhenSave(this._nowFun);
            if (_Str.notEmpty(error)) {
                _Tool.msg(error);
                return;
            }
        }
        const formData = new FormData();
        const json = this._getUpdJson(formData);
        if (_Json.isEmpty(json)) {
            _Tool.msg(_BR.SaveNone);
            return;
        }
        if (_Fun.hasValue(_me.fnWhenSave2)) {
            const error = _me.fnWhenSave2(this._nowFun, json);
            if (_Str.notEmpty(error)) {
                _Tool.msg(error);
                return;
            }
        }
        const edit0 = _me.edit0;
        const isNew = (this._nowFun == FunEstr.Create);
        const action = isNew ? 'Create' : 'Update';
        let data = null;
        const me = this;
        if (this._hasFile()) {
            data = formData;
            data.append('json', _Json.toStr(json));
            if (!isNew) {
                data.append('key', edit0.getKey());
            }
            if (this._multiEdit) {
                data.append('editNo', this._nowEditNo);
            }
            await _Ajax.getJsonByFdA(action, data, function (result) {
                me.afterSave(result);
            });
        }
        else {
            data = { json: _Json.toStr(json) };
            if (!isNew) {
                data.key = edit0.getKey();
            }
            if (this._multiEdit) {
                data.editNo = this._nowEditNo;
            }
            await _Ajax.getJsonA(action, data, function (result) {
                me.afterSave(result);
            });
        }
    }
    async onDraftA() {
        const formData = new FormData();
        const json = this._getUpdJson(formData);
        if (_Json.isEmpty(json)) {
            _Tool.msg(_BR.SaveNone);
            return;
        }
        const edit0 = _me.edit0;
        const action = 'Draft';
        let data = null;
        const me = this;
        if (this._hasFile()) {
            data = formData;
            data.append('json', _Json.toStr(json));
            data.append('key', edit0.getKey());
            if (this._multiEdit) {
                data.append('editNo', this._nowEditNo);
            }
            await _Ajax.getJsonByFdA(action, data, function (result) {
                me._afterSaveDraft(result);
            });
        }
        else {
            data = { json: _Json.toStr(json) };
            data.key = edit0.getKey();
            if (this._multiEdit) {
                data.editNo = this._nowEditNo;
            }
            await _Ajax.getJsonA(action, data, function (result) {
                me._afterSaveDraft(result);
            });
        }
    }
}

import _iDate from './_iDate';
import _Var from './_Var';
import _Prog from './_Prog';
import _File from './_File';
import _Tool from './_Tool';
import _Str from './_Str';
import _iCheck from './_iCheck';
import _iRadio from './_iRadio';
import _Form from './_Form';
import _Obj from './_Obj';
import _Json from './_Json';
import _Ajax from './_Ajax';
import FunEstr from '../Enums/FunEstr';
import Datatable from './Datatable';
import CrudE from './CrudE';
export default class CrudR {
    temp;
    divRead;
    dt;
    _updName;
    hasDraft;
    constructor(dtConfig, edits, updName) {
        //save middle variables
        this.temp = {};
        //1.set instance variables
        this.divRead = $('#divRead');
        var rform = null;
        var rform2 = null;
        var hasRead = this.divRead.length > 0;
        if (hasRead) {
            rform = $('#formRead');
            if (rform.length === 0)
                rform = null;
            rform2 = $('#formRead2');
            if (rform2.length === 0)
                rform2 = null;
            if (rform != null)
                _iDate.init(rform);
            if (rform2 != null)
                _iDate.init(rform2);
            //4.Create Datatable object
            //傳入 _me.fnAfterFind if any !!
            if (_Var.notEmpty(dtConfig)) {
                this.dt = new Datatable('#tableRead', 'GetPage', dtConfig, this._getFindCond(), null, null, _me.fnAfterFind || null);
            }
        }
        //this._Edits = edits;
        this._updName = updName;
        //是否有草稿功能
        this.hasDraft = $('#btnDraft').length > 0;
        //2.init edit
        new CrudE(edits);
        //3.set prog path
        _Prog.init();
        //set _me
        _me.crudR = this;
        _me.rform = rform;
        _me.rform2 = rform2;
        _me.hasRead = hasRead;
        _me.divRead = this.divRead;
    }
    /**
     * onclick viewFile
     * @param table {string} table name
     * @param fid {string}
     * @param elm {element} link element
     * @param key {string} row key
     */
    viewFile(table, fid, key, fileName) {
        var ext = _File.getFileExt(fileName);
        if (_File.isImageExt(ext))
            _Tool.showImage(fileName, _Str.format('ViewFile?table={0}&fid={1}&key={2}&ext={3}', table, fid, key, ext));
    }
    /**
     * button html string
     * @param id {string}
     * @param label {string}
     * @param fnOnclick {string}
     * @param fnArgs {string} 多個時逗號分隔
     * @returns button html string
     */
    dtBtn(id, label, fnOnclick) {
        return `<button type="button" class="btn btn-sm x-btn-other" data-onclick="${fnOnclick}" data-args="${id}">${label}</button>`;
    }
    /**
     * checkbox for multiple select
     * @param value {string} [1] checkbox value
     * @param editable {bool} [true]
     */
    dtCheck0(value, editable) {
        if (_Str.isEmpty(value))
            value = 1;
        //attr
        var attr = "data-fid='" + _iCheck.fidCheck0 + "'" + " data-value='" + value + "'";
        if (editable === false)
            attr += ' readonly';
        //if (checked)
        //    attr += ' checked';
        //x-no-label for checked sign position
        return ('' +
            "<label class='xi-check x-no-label'>" +
            '   <input ' +
            attr +
            " type='checkbox'>" +
            "   <span class='xi-cspan'></span>" +
            '</label>');
    }
    //??
    dtRadio1(value, editable) {
        if (editable === undefined)
            editable = true;
        return _iRadio.render(_iCheck.fidCheck0, '', false, value, editable);
    }
    /**
     * set status column(checkbox)
     * @param value {string} checkbox value, will translate to bool
     * @param fnOnClick {string} onclick function, default to this.onSetStatusA
     */
    dtSetStatus(key, value, fnOnClick) {
        //TODO: pending
        return '';
        /*
        //debugger;
        var checked = _Str.toBool(value);
        if (_Str.isEmpty(fnOnClick)) {
            fnOnClick = `_me.crudR.onSetStatusA(this,\'{0}\')`, key);
        }
        //??
        return _iCheck.render2(0, '', 1, checked, '', true, '', "onclick=" + fnOnClick);
        */
    }
    dtStatusName(value) {
        return value == '1'
            ? '<span>' + _BR.StatusYes + '</span>'
            : '<span class="text-danger">' + _BR.StatusNo + '</span>';
    }
    dtYesEmpty(value) {
        return value == '1' ? _BR.Yes : '';
    }
    //顯示紅色文字 by status
    dtRed(text, status) {
        return status
            ? '<span class="text-danger">' + text + '</span>'
            : '<span>' + text + '</span>';
    }
    /**
     * !! change link to button
     * 取消參數 fnOnUpdate, fnOnDelete, fnOnView
     * crud functions: update,delete,view
     * @param key {string} row key
     * @param rowName {string} for show row name before delete
     * @param hasUpdate {bool} has update icon or not
     * @param hasDelete {bool} has delete icon or not
     * @param hasView {bool} has view icon or not
     */
    //dtCrudFun(key, rowName, hasUpdate, hasDelete, hasView, fnOnUpdate, fnOnDelete, fnOnView) {
    dtCrudFun(key, rowName, hasUpdate, hasDelete, hasView, hasCopy) {
        const preStr = `button type="button" class="btn btn-link"`;
        var funs = '';
        if (hasUpdate)
            funs += `<${preStr} data-onclick="_me.crudE.onUpdateA" data-args="${key}"><i class="ico-pen" title="${_BR.TipUpdate}"></i></button>`;
        if (hasDelete)
            funs += `<${preStr} data-onclick="_me.crudR.onDeleteA" data-args="${key},${rowName}"><i class="ico-delete x-delete" title="${_BR.TipDelete}"></i></button>`;
        if (hasView)
            funs += `<${preStr} data-onclick="_me.crudE.onViewA" data-args="${key}"><i class="ico-eye" title="${_BR.TipView}"></i></button>`;
        if (hasCopy)
            funs += `<${preStr} data-onclick="_me.crudE.onCopyA" data-args="${key}"><i class="ico-copy" title="${_BR.TipCopy}"></i></button>`;
        return funs;
    }
    /**
     * get Find condition
     */
    _getFindCond() {
        if (_me.rform == null)
            return null;
        var row = _Form.toRow(_me.rform);
        var find2 = _me.rform2;
        if (find2 !== null && _Obj.isShow(find2))
            _Json.copy(_Form.toRow(find2), row);
        return row;
    }
    /**
     * 移除參數 nowDiv, fnCallback
     * change newDiv to active
     * @param toRead {bool} show divRead or not
     * //param nowDiv {object} (default _me.divEdit) now div to show
     * //param fnCallback {function} (optional) callback function
     */
    swap(toRead, fnCallback) {
        //同時有read, edit才執行
        if (!_me.hasRead || !_me.hasEdit)
            return;
        //考慮多個編輯畫面
        var divEdit = _me.crudE.mEditGetDivEdit();
        var oldDiv, newDiv;
        if (toRead) {
            oldDiv = divEdit;
            newDiv = this.divRead;
        }
        else {
            oldDiv = this.divRead;
            newDiv = divEdit;
        }
        oldDiv.addClass('x-off');
        setTimeout(() => {
            oldDiv.addClass('d-none').removeClass('x-off');
            newDiv.removeClass('d-none').addClass('x-on');
            setTimeout(() => {
                newDiv.removeClass('x-on');
                if (fnCallback) {
                    fnCallback();
                    if (_me.fnAfterSwap)
                        _me.fnAfterSwap(toRead);
                    if (toRead)
                        _me.crudE.mEditSetEditNo(0);
                }
            }, 500);
        }, 200);
        if (_me.fnAfterSwap)
            _me.fnAfterSwap(toRead);
        //還原 nowEditNo
        if (toRead)
            _me.crudE.mEditSetEditNo(0);
    }
    /**
     * to edit mode
     * XpFlowSign Read.cshtml 待處理!!
     * param fun {string} U/V
     * param fnCallback {function} 如果進入編輯畫面後要處理畫面, 必須以非同步方式處理
     */
    //toEditMode = function(fun, data) {
    toEditMode(fun, fnCallback) {
        this.swap(false, fnCallback); //call first
        _Prog.setPath(fun, this._updName);
    }
    /**
     * back to list form
     */
    toReadMode() {
        //_Obj.show(this.divReadTool);
        _Prog.resetPath();
        this.swap(true);
    }
    /**
     * call fnAfterSwap if existed
     * @param toRead {bool} to read mode or not
     */
    /*
    _afterSwap(toRead) {
        if (_me.fnAfterSwap)
            _me.fnAfterSwap(toRead);
    }
    */
    //=== event start ===
    /**
     * onclick find rows
     */
    onFind() {
        var cond = this._getFindCond();
        this.dt.find(cond);
    }
    /**
     * onclick find2 button for show/hide find2 form
     */
    onFind2() {
        var find2 = _me.rform2;
        if (find2 == null)
            return;
        else if (_Obj.isShow(find2))
            _Form.hideShow([find2]);
        else
            _Form.hideShow(null, [find2]);
    }
    /**
     * onclick reset find form
     */
    onResetFind() {
        _Form.reset(_me.rform);
        if (_me.rform2 != null)
            _Form.reset(_me.rform2);
    }
    /**
     * onClick export excel button
     */
    onExport() {
        var find = this._getFindCond();
        window.location = 'Export?find=' + _Json.toStr(find);
    }
    /**
     * onclick toRead button
     */
    onToRead() {
        this.toReadMode();
    }
    /**
     * onclick Create button
     * 字尾暫不加上A(非同步)
     */
    async onCreate() {
        //var fun = FunEstr.Create;
        //this.swap(false);  //call first
        //_Prog.setPath(fun);
        var me = this;
        if (this.hasDraft) {
            //讀取草稿 if any
            await _Ajax.getJsonA('GetDraftJson', { key: '' }, function (json) {
                if (_Json.isEmpty(json))
                    me.createAndEdit();
                else
                    _me.crudE.loadJsonAndEdit(json, FunEstr.Create);
            });
        }
        else {
            this.createAndEdit();
            /*
            _me.crudE.onCreate();
            this.toEditMode(FunEstr.Create);
            */
        }
    }
    createAndEdit() {
        _me.crudE.onCreate();
        this.toEditMode(FunEstr.Create);
    }
    /**
     * call _me.crudE
     * onclick Update button
     * @param key {string} row key
     */
    /*
    async onUpdateA(key) {
        //_me.crudE._getJsonAndSetMode(key, FunEstr.Update);
        //this.toEditMode(FunEstr.Update);
        await _me.crudE.onUpdateA(key);
    }
    */
    /**
     * call _me.crudE
     * onclick View button
     * @param key {string} row key
     */
    /*
    async onViewA(key) {
        //_me.crudE._getJsonAndSetMode(key, FunEstr.View);
        await _me.crudE.onViewA(key);
        //this.toEditMode(FunEstr.View);
    }
    */
    /**
     * click setStatus, 固定呼叫後端 SetStatus action
     * me {element} checkbox element
     * key {string} row key
     */
    async onSetStatusA(me, key) {
        var status = _iCheck.isCheckedO($(me));
        await _Ajax.getStrA('SetStatus', { key: key, status: status }, function (msg) {
            _Tool.alert(_BR.UpdateOk);
        });
    }
    /**
     * TODO: need test
     * onclick check all, check/uncheck box all checkbox of fid field
     * @param me {string} row key
     * @param box {string} row key
     * @param fid {string} fid
     */
    //onCheckAll(me, box, fid) {
    onCheckAll(me, box) {
        _iCheck.setF(_iCheck.fltCheckeds + ':not(:disabled)', _iCheck.isCheckedO($(me)), box);
    }
    /**
     * onclick Delete, call backend Delete()
     * key {string} row key
     * rowName {string} for confirm
     */
    async onDeleteA(key, rowName) {
        //_temp.data = { key: key }
        var me = this;
        _Tool.ans(_BR.SureDeleteRow + ' (' + rowName + ')', async function () {
            await _Ajax.getJsonA('Delete', { key: key }, function (msg) {
                _Tool.alert(_BR.DeleteOk);
                me.dt.reload();
            });
        });
    }
    /**
     * TODO: need test
     * 移除參數 fid
     * no called
     * 刪除選取的多筆資料, 後端固定呼叫 DeleteByKeys()
     * box {string} row key
     * fid {string}
     */
    //async onDeleteRowsA(box, fid) {
    async onDeleteRowsA(box) {
        //get selected keys
        var keys = _iCheck.getCheck0Values(box);
        if (keys.length === 0) {
            _Tool.msg(_BR.PlsSelectDeleted);
            return;
        }
        //刪除多筆資料, 後端固定呼叫 DeleteByKeys()
        //_temp.data = { keys: keys }
        var me = this;
        _Tool.ans(_BR.SureDeleteSelected, async function () {
            await _Ajax.getStrA('DeleteByKeys', { keys: keys }, function (msg) {
                _Tool.alert(_BR.DeleteOk);
                me.dt.reload();
            });
        });
    }
}

import _Fun from './_Fun';
import _Json from './_Json';
import _Ajax from './_Ajax';
import _Tool from './_Tool';
import _Var from './_Var';
export default class Datatable {
    dt;
    findJson;
    recordsFiltered;
    defaultShowOk;
    showWork;
    _fnAfterFind;
    _keepStart;
    _start;
    _nowShowOk;
    constructor(selector, url, dtConfig, findJson, fnOk, tbarHtml, fnAfterFind) {
        //public property 
        this.dt = null; //jquery datatables object
        this.findJson = findJson; //find condition
        this.recordsFiltered = -1; //found count, -1 for recount, name map to DataTables
        this.defaultShowOk = true; //whethor show find ok msg, default value
        this.showWork = (dtConfig && dtConfig.showWork == null) ? false : dtConfig.showWork;
        this._fnAfterFind = fnAfterFind;
        //private
        //keep start row idx, false(find), true(save reload)
        this._keepStart = false;
        //now start row idx, coz ajax.dataSrc() always get 0 !!
        this._start = 0;
        //(now)show find ok msg or not
        this._nowShowOk = this.defaultShowOk;
        //default config for dataTables
        var config = {
            //deferLoading: 0,    //0表示一開始不自動執行
            pageLength: _Fun.pageRows || 10,
            lengthMenu: _Fun.lengthMenu,
            processing: false, //use custom processing msg
            serverSide: true, //server pagination
            jQueryUI: false,
            filter: false, //find string            
            paginate: true, //paging          
            lengthChange: true, //set page rows
            info: true, //show page info, include now page, total pages
            sorting: [], //default not sorting, or datatable will sort by first column !!
            pagingType: "full_numbers",
            //stateSave: true,
            //ordering: false,
            //set locale file
            language: {
                url: "/locale/" + _Fun.locale + "/dataTables.json",
            },
            //default toolbar layout
            //dom: '<"toolbar">t<li>p', 
            dom: `
t
<"row d-flex justify-content-between align-items-center mt-2"
    <"col d-flex align-items-center gap-2 li-container"li>
    <"col-auto"p>
>
`,
            //call after dataTables initialize
            //1.add toolbar button list if need
            //2.change find action: find after enter !!
            initComplete: function (settings, json) {
                //1.toolbar
                if (tbarHtml)
                    $(this.dt).closest('.tableRead_wrapper').find('div.toolbar').html(tbarHtml);
                //check filter existed
                var filter = $(selector + "_filter input");
                if (filter.length > 0) {
                    //2.unbind first
                    filter.off();
                    //bind key enter for quick search
                    var api = (this.dt).api();
                    filter.on('keyup', function (e) {
                        if (e.key === 'Enter') {
                            this.resetCount();
                            //run search
                            api.search(this.value).draw(); //must draw() !!
                        }
                    });
                }
                else {
                    //console.log('no dataTables filter !!');
                    //return;
                }
            }.bind(this),
            //ajax config(not standard jquery ajax !!)
            //me: this,
            ajax: {
                //config
                url: url,
                type: 'POST',
                dataType: 'json',
                /*
                beforeSend: function (jqXHR) {
                    //debugger;
                    if (_Fun.jwtToken)
                        jqXHR.setRequestHeader("Authorization", "Bearer " + _Fun.jwtToken);
                },
                */
                //add input parameter for datatables
                data: function (arg) {
                    //如果存在 _me.fnWhenFind(傳回bool), 則先檢查
                    if (_me && _me.fnWhenFind) {
                        if (!_me.fnWhenFind())
                            return;
                    }
                    //write order.fid if any
                    var orders = arg.order;
                    if (orders.length > 0) {
                        var order = orders[0];
                        order.fid = arg.columns[order.column].data;
                    }
                    arg.findJson = _Json.toStr(this.findJson); //string type
                    arg.recordsFiltered = this.recordsFiltered;
                    if (this._keepStart)
                        arg.start = this._start;
                }.bind(this),
                //on success (cannot use success event), see DataTables document !!
                dataSrc: function (result) {
                    this._start = this.dt.page.info().start;
                    this._keepStart = false; //reset
                    //只顯示錯誤訊息, 不處理欄位 validation error
                    var errMsg = _Ajax.resultToErrMsg(result);
                    if (errMsg) {
                        _Tool.msg(errMsg);
                        result.recordsFiltered = 0;
                        this.recordsFiltered = 0;
                        return []; //no null, or jquery will get wrong !!
                    }
                    else {
                        //set global
                        this.recordsFiltered = result.recordsFiltered;
                        if (fnOk) {
                            return fnOk(result);
                        }
                        else if (result.data === null || result.data.length === 0) {
                            _Tool.alert(_BR.FindNone, 'R');
                            if (this._fnAfterFind)
                                this._fnAfterFind({});
                            return [];
                        }
                        else {
                            if (this._nowShowOk)
                                _Tool.alert(_BR.FindOk);
                            this._nowShowOk = this.defaultShowOk; //reset to default
                            if (this._fnAfterFind)
                                this._fnAfterFind(result);
                            return result.data;
                        }
                    }
                }.bind(this),
                //on error
                error: function (xhr, ajaxOptions, thrownError) {
                    _Tool.hideWait();
                    _Tool.msg('Datatable.js error.');
                    if (xhr != null) {
                        console.log('status' + xhr.status);
                        console.log(thrownError);
                    }
                },
            },
        };
        //add custom columnDefs
        if (dtConfig) {
            if (_Var.notEmpty(dtConfig.columnDefs)) {
                var colDefs = dtConfig.columnDefs;
                colDefs[colDefs.length] = _Fun.dtColDef; //add last array element
            }
            config = _Json.copy(dtConfig, config);
        }
        //add data-rwd-th if need
        var dt = $(selector);
        /*
        if (_Fun.isRwd) {
            //讀取多筆資料 header (set this._rwdTh[])
            var me = this;
            me._rwdTh = [];
            dt.find('th').each(function (idx) {
                me._rwdTh[idx] = $(this).text() + '：';
            });
            config.createdRow = function (row, data, dataIndex) {
                $(row).find('td').each(function (idx) {
                    $(this).attr('data-rwd-th', me._rwdTh[idx]);
                });
            };
        }
        */
        this.dt = dt.DataTable(config);
        // 在 settings 物件掛自訂屬性
        this.dt.settings()[0].showWork = this.showWork;
        //before/after ajax call, show/hide waiting msg
        dt.on('preXhr.dt', function (e, settings, data) {
            if (settings.showWork)
                _Fun.block();
        });
        dt.on('xhr.dt', function (e, settings, data) {
            if (settings.showWork)
                _Fun.unBlock();
        });
    }
    /**
     * reset found count
     */
    resetCount() {
        //var count = reset ? -1 : this.dt.recordsFiltered;
        this.recordsFiltered = -1;
    }
    /**
     * find rows
     * param findJson {json} find condition
     */
    find(findJson) {
        this.findJson = findJson;
        //this.findStr = findStr || '';
        this.resetCount(); //recount first
        //trigger dataTables search event
        //this.dt.search(this.findStr).draw();
        this.dt.search('').draw(!this._keepStart);
    }
    /**
     * refind with same condition for refresh form
     * not show find ok msg
     */
    reload() {
        this._keepStart = true;
        this._nowShowOk = false; //not show find ok msg
        this.find(this.findJson);
    }
}

import Mustache from "mustache";
import EditModeEstr from '../Enums/EditModeEstr';
import _Edit from './_Edit';
import _Str from './_Str';
import _Obj from './_Obj';
import _Input from './_Input';
import _iCheck from './_iCheck';
import _iDate from './_iDate';
import _Var from './_Var';
import _Form from './_Form';
import _Log from './_Log';
import _Fun from './_Fun';
import _iText from './_iText';
import _iFile from './_iFile';
export default class EditMany {
    [_Edit.Childs] = null;
    mode = EditModeEstr.Base;
    modeData = '';
    systemError = '';
    kid;
    rowFilter;
    sortFid;
    hasRowTpl;
    hasRowFilter;
    rowTpl = '';
    hasEform;
    rowsBox = $();
    eform = $();
    deletedRows = [];
    newIndex = 0;
    fidTypeLen;
    fidTypes;
    fidRadios;
    validator;
    fnReset;
    fnLoadRows;
    fnValid;
    fnGetUpdJson;
    hasFile;
    fileLen;
    fileFids;
    constructor(kid, rowsBoxId, rowTplId, rowFilter, sortFid) {
        this.kid = kid;
        this.rowFilter = rowFilter || '';
        this.sortFid = sortFid;
        this.hasRowTpl = _Str.notEmpty(rowTplId);
        this.hasRowFilter = _Str.notEmpty(rowFilter);
        if (this.hasRowTpl) {
            this.rowTpl = $('#' + rowTplId).html();
            var rowObj = $(this.rowTpl);
            if (_Obj.get(kid, rowObj) == null) {
                this.systemError = `EditMany.js input kid is wrong (${kid})`;
                alert(this.systemError);
            }
            _Edit.initVars(this, rowObj);
        }
        this.hasEform = _Str.notEmpty(rowsBoxId);
        if (this.hasEform) {
            this.rowsBox = $('#' + rowsBoxId);
            this.eform = this.rowsBox.closest('form');
            if (this.rowsBox.length == 0) {
                this.systemError = `EditMany.js rowsBoxId is wrong (${rowsBoxId})`;
                alert(this.systemError);
            }
        }
        this.deletedRows = [];
        this.newIndex = 0;
    }
    showErrors(rows) {
        if (rows == null)
            return;
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var item = _Obj.get(row.fid, this.idToRowBox(row.id));
            this.validator.showLabel(item[0], row.msg);
            item.addClass('error');
        }
    }
    setChilds(childs) {
        this[_Edit.Childs] = childs;
    }
    initUrm(fids) {
        this.mode = EditModeEstr.UR;
        this.modeData = fids;
    }
    _isNewBox(box) {
        return _Edit.isNewBox(box, this.kid);
    }
    reset(rowsBox, forNew) {
        if (forNew == null)
            forNew = false;
        rowsBox = this._getRowsBox(rowsBox);
        if (this.fnReset) {
            this.fnReset();
        }
        else if (this.mode == EditModeEstr.UR) {
            this._urmReset();
        }
        else if (this.hasEform) {
            rowsBox.empty();
            this._resetVar();
        }
    }
    _resetVar() {
        this.newIndex = 0;
        this._resetDeletes();
    }
    _resetDeletes() {
        this.deletedRows = [];
    }
    _urmLoadRows(rows) {
        this._urmReset();
        if (rows == null)
            return;
        var fids = this.modeData;
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var obj = this.rowsBox.find(_Input.fidFilter(row[fids[1]]));
            _iCheck.setO(obj, 1);
            obj.data('key', row[fids[0]]);
        }
    }
    _urmGetUpdJson(upKey) {
        var json = {};
        var rows = [];
        var me = this;
        var newIdx = 0;
        var fids = this.modeData;
        this._resetDeletes();
        this.rowsBox.find(':checkbox').each(function () {
            var obj = $(this);
            var key = obj.data('key');
            if (_Str.isEmpty(key)) {
                if (_iCheck.isCheckedO(obj)) {
                    var row = {};
                    row[fids[0]] = --newIdx;
                    row[fids[1]] = _iCheck.getO(obj);
                    me.rowSetFkey(row, upKey);
                    rows[rows.length] = row;
                }
            }
            else {
                if (!_iCheck.isCheckedO(obj)) {
                    me.deleteRow(key);
                }
            }
        });
        if (rows.length > 0)
            json[_Edit.Rows] = rows;
        json[_Edit.Deletes] = this.getDeletes();
        return json;
    }
    _urmReset() {
        this._resetVar();
        var objs = this.rowsBox.find(':checkbox');
        _iCheck.setO(objs, 0);
        objs.data('key', '');
    }
    loadRowsBySys(rows) {
        if (this.fnLoadRows) {
            this.fnLoadRows(rows);
        }
        else if (this.mode == EditModeEstr.UR) {
            this._urmLoadRows(rows);
        }
        else {
            this.loadRowsByRsb(rows, true);
        }
    }
    loadRowByBox(rowBox, row, index) {
        row.Index = index;
        var tr = $(Mustache.render(this.rowTpl, row));
        var fid;
        for (var i = 0; i < this.fidTypeLen; i = i + 2) {
            fid = this.fidTypes[i];
            _Edit.setOld(_Obj.get(fid, tr), row[fid]);
        }
        for (var i = 0; i < this.fidRadios.length; i++) {
            fid = this.fidRadios[i];
            tr.find(`[name='${fid}']`).attr('name', `${fid}_${index}`);
        }
        _iDate.init(tr);
        _Form.loadRow(tr, row);
        tr.appendTo(rowBox);
    }
    loadRowsByRsb(rows, reset, rowsBox) {
        if (!this._checkRowTpl())
            return;
        rowsBox = this._getRowsBox(rowsBox);
        if (_Var.isEmpty(reset) || reset)
            this.reset(rowsBox);
        var rowLen = (rows == null) ? 0 : rows.length;
        if (rowLen == 0)
            return;
        for (var i = 0; i < rowLen; i++) {
            this.loadRowByBox(rowsBox, rows[i], i);
        }
    }
    valid() {
        return this.fnValid ? this.fnValid() :
            this.hasEform ? this.eform.validTable(this.validator) :
                true;
    }
    getKey(rowBox) {
        return _Input.get(this.kid, rowBox);
    }
    _checkRowFilter() {
        if (this.hasRowFilter)
            return true;
        _Log.error('EditMany.js this.rowFilter is empty.');
        return false;
    }
    _checkRowTpl() {
        if (this.hasRowTpl)
            return true;
        _Log.error('EditMany.js this.rowTpl is empty.');
        return false;
    }
    _elmToRowBox(elm) {
        return this._checkRowFilter()
            ? $(elm).closest(this.rowFilter)
            : null;
    }
    idToRowBox(id) {
        var filter = _Input.fidFilter(this.kid) + `[value='${id}']`;
        return this.eform.find(filter).closest(this.rowFilter);
    }
    getUpdJsonBySys(upKey) {
        if (this.fnGetUpdJson)
            return this.fnGetUpdJson(upKey);
        else if (this.mode == EditModeEstr.UR)
            return this._urmGetUpdJson(upKey);
        else
            return this.getUpdJsonByRsb(upKey, this.rowsBox);
    }
    getUpdJsonByRsb(upKey, rowsBox) {
        var json = {};
        json[_Edit.Rows] = this.getUpdRows(upKey, this._getRowsBox(rowsBox));
        json[_Edit.Deletes] = this.getDeletes();
        return json;
    }
    getUpdRow(box) {
        return _Edit.getUpdRow(this, box);
    }
    getUpdRows(upKey, rowsBox) {
        if (!this._checkRowFilter())
            return null;
        rowsBox = this._getRowsBox(rowsBox);
        this.setSort(rowsBox);
        var rows = [];
        var me = this;
        rowsBox.find(me.rowFilter).each(function (idx, item) {
            var box = $(item);
            var key = _Input.get(me.kid, box);
            if (me._isNewBox(box)) {
                var row2 = _Form.toRow(box);
                row2[_Edit.DataFkeyFid] = upKey;
                rows.push(row2);
                return;
            }
            var diffRow = {};
            var diff = false;
            var fid, ftype, value, obj;
            for (var j = 0; j < me.fidTypes.length; j = j + 2) {
                fid = me.fidTypes[j];
                obj = _Obj.get(fid, box);
                if (obj.hasClass('xi-unsave'))
                    continue;
                ftype = me.fidTypes[j + 1];
                value = _Input.getO(obj, box, ftype);
                if (value != _Edit.getOld(obj)) {
                    diffRow[fid] = value;
                    diff = true;
                }
            }
            if (diff) {
                diffRow[me.kid] = key;
                rows.push(diffRow);
            }
        });
        return (rows.length === 0) ? null : rows;
    }
    getDeletes() {
        return (this.deletedRows.length === 0)
            ? null : this.deletedRows.join();
    }
    onAddRow() {
        this.addRow();
    }
    addRow(row, rowsBox, newId) {
        row = row || {};
        rowsBox = this._getRowsBox(rowsBox);
        var obj = this._renderRow(row, rowsBox);
        newId = this.setNewIdByBox(obj, newId);
        row[this.kid] = newId;
        return row;
    }
    onDeleteRow() {
        var box = this._elmToRowBox(_Fun.getMe());
        if (box) {
            this.deleteRow(_iText.get(this.kid, box), box);
        }
    }
    deleteRow(key, rowBox) {
        var deletes = this.deletedRows;
        var found = false;
        var rowLen = deletes.length;
        for (var i = 0; i < rowLen; i++) {
            if (deletes[i] === key) {
                found = true;
                break;
            }
        }
        if (!found)
            deletes[rowLen] = key;
        if (_Obj.notEmpty(rowBox))
            rowBox.remove();
    }
    deleteAll() {
        var me = this;
        this.rowsBox.find(this.rowFilter).each(function () {
            var box = $(this);
            var key = _Input.get(me.kid, box);
            me.deleteRow(key, box);
        });
    }
    async onViewFile(table, fid) {
        var elm = _Fun.getMeElm();
        var box = this._elmToRowBox(elm);
        if (box) {
            var key = this.getKey(box);
            await _Edit.viewFileA(table, fid, elm, key);
        }
    }
    _renderRow(row, rowsBox) {
        if (!this._checkRowTpl())
            return null;
        rowsBox = this._getRowsBox(rowsBox);
        var obj = $(Mustache.render(this.rowTpl, row));
        _Form.loadRow(obj, row);
        obj.appendTo(rowsBox);
        return obj;
    }
    dataAddFiles(levelStr, data, rowsBox) {
        if (!this.hasFile)
            return null;
        if (!this._checkRowFilter())
            return null;
        rowsBox = this._getRowsBox(rowsBox);
        var me = this;
        var fileJson = {};
        var fileIdx = {};
        rowsBox.find(me.rowFilter).each(function (index, item) {
            var tr = $(item);
            for (var i = 0; i < me.fileLen; i++) {
                var fid = me.fileFids[i];
                var serverFid = _Edit.getFileSid(levelStr, fid);
                if (_iFile.dataAddFile(data, fid, serverFid, tr)) {
                    fileIdx[fid] = (fileIdx[fid] == null) ? 0 : fileIdx[fid] + 1;
                    fileJson[serverFid + fileIdx[fid]] = me.getKey(tr);
                }
            }
        });
        return fileJson;
    }
    rowSetFkey(row, fkey) {
        if (row != null && _Edit.isNewRow(row, fkey))
            row[_Edit.DataFkeyFid] = fkey;
    }
    rowsSetFkey(rows, fkey) {
        if (rows != null) {
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                if (row != null && _Edit.isNewRow(row, this.kid))
                    row[_Edit.DataFkeyFid] = fkey;
            }
        }
    }
    rowsToNew() {
        if (this.rowsBox == null || this.rowsBox.length == 0)
            return;
        var me = this;
        me.newIndex = 0;
        me.rowsBox.find(me.rowFilter).each(function () {
            me.newIndex--;
            _iText.set(me.kid, me.newIndex, $(this));
        });
    }
    setNewIndex(index) {
        this.newIndex = Math.abs(index) * -1;
    }
    setNewIdByBox(box, newId) {
        if (newId == null) {
            this.newIndex--;
            newId = this.newIndex;
        }
        var box2 = _Obj.get(this.kid, box).closest(this.rowFilter);
        _iText.set(this.kid, newId, box2);
        return newId;
    }
    setSort(rowsBox) {
        var sortFid = this.sortFid;
        if (_Str.isEmpty(sortFid))
            return;
        var me = this;
        rowsBox = this._getRowsBox(rowsBox);
        rowsBox.find(_Input.fidFilter(sortFid)).each(function (i, item) {
            _iText.set(sortFid, i, $(item).closest(me.rowFilter));
        });
    }
    _getRowsBox(rowsBox) {
        return rowsBox || this.rowsBox;
    }
}

import _Edit from './_Edit';
import _Obj from './_Obj';
import _Form from './_Form';
import _iText from './_iText';
import _Str from './_Str';
import _Tool from './_Tool';
import _Input from './_Input';
import _Json from './_Json';
import _iFile from './_iFile';
import _Fun from './_Fun';
export default class EditOne {
    [_Edit.Childs];
    kid;
    eform;
    is1to1;
    dataJson;
    systemError;
    validator;
    fidTypes;
    fidRadios;
    hasFile;
    fileLen;
    fileFids;
    fnValid;
    constructor(kid, eformId, childs) {
        this[_Edit.Childs] = childs;
        this.kid = kid || 'Id';
        eformId = eformId || 'eform';
        this.eform = $('#' + eformId);
        this.is1to1 = false;
        this.dataJson = null;
        this.systemError = '';
        var error = (this.eform.length != 1) ? 'EditOne.js input eformId is wrong. (' + eformId + ')' :
            (_Obj.get(this.kid, this.eform) == null) ? 'EditOne.js input kid is wrong. (' + this.kid + ')' :
                '';
        if (error != '') {
            this.systemError = error;
            alert(error);
        }
        _Edit.initVars(this, this.eform);
    }
    showErrors(json) {
        this.validator.showErrors(json);
    }
    setIs1to1() {
        this.is1to1 = true;
    }
    _resetAndNew(init) {
        _Form.reset(this.eform, init);
        _iText.set(this.kid, -1, this.eform);
    }
    valid() {
        if (_Str.notEmpty(this.systemError)) {
            _Tool.msg(this.systemError);
            return false;
        }
        if (!this.eform.valid())
            return false;
        return (this.fnValid) ? this.fnValid() : true;
    }
    getKey() {
        return _Input.get(this.kid, this.eform);
    }
    getValue(fid) {
        return _Input.get(fid, this.eform);
    }
    isNewRow() {
        return _Edit.isNewBox(this.eform, this.kid);
    }
    loadRow(row) {
        if (this.is1to1 && _Json.isEmpty(row))
            this._resetAndNew();
        else
            _Edit.loadRow(this, this.eform, row);
    }
    getUpdRow(upKey) {
        var row = _Edit.getUpdRow(this, this.eform);
        if (this.is1to1 && row != null) {
            row[_Edit.DataFkeyFid] = upKey;
            return row;
        }
        else {
            return row;
        }
    }
    reset(init) {
        if (this.is1to1)
            this._resetAndNew(init);
        else
            _Form.reset(this.eform, init);
    }
    resetKey() {
        _Input.set(this.kid, '', this.eform);
    }
    setEdit(status) {
        _Form.setEdit(this.eform, status);
    }
    dataAddFiles(levelStr, data) {
        if (!this.hasFile)
            return null;
        var fileJson = {};
        for (var i = 0; i < this.fileLen; i++) {
            var fid = this.fileFids[i];
            var serverFid = _Edit.getFileSid(levelStr, fid);
            if (_iFile.dataAddFile(data, fid, serverFid, this.eform)) {
                fileJson[serverFid] = this.getKey();
            }
        }
        return fileJson;
    }
    async onViewFile(table, fid) {
        var elm = _Fun.getMeElm();
        var key = this.getKey();
        await _Edit.viewFileA(table, fid, elm, key);
    }
}

import MouseEstr from '../Enums/MouseEstr';
export default class FlowLine {
    MaxCntCnt1 = 6;
    MinSideCnt2 = 16;
    MinCntCnt3 = 20;
    MinSideSide13 = 12;
    ArrowLen = 10;
    ArrowWidth = 5;
    FromTypeAuto = 'A';
    FromTypeV = 'V';
    FromTypeH = 'H';
    flowView;
    json;
    svg;
    fromNode;
    toNode;
    path;
    path2;
    labelElm;
    arrow;
    fromType;
    isFromTypeV;
    isFromTypeH;
    constructor(flowView, json, fromNode, toNode) {
        json = json || {};
        json.FromType = json.FromType || this.FromTypeAuto;
        json.Label = json.Label || '';
        json.Id = json.Id || flowView.getNewLineId();
        this.flowView = flowView;
        this.json = json;
        this.svg = flowView.svg;
        this.fromNode = fromNode || this.flowView.idToNode(json.FromNodeId);
        this.toNode = toNode || this.flowView.idToNode(json.ToNodeId);
        this.path = this.svg.path('')
            .attr('data-id', json.Id)
            .addClass('xf-line');
        this.path2 = this.svg.path('')
            .attr('data-id', json.Id)
            .fill('none')
            .stroke({ width: 10, color: 'transparent' })
            .attr({ 'pointer-events': 'stroke', 'cursor': 'pointer' });
        this.labelElm = this.svg.text(json.Label)
            .addClass('xf-line-text')
            .font({ anchor: 'middle' });
        this.arrow = this.svg.path('').addClass('xf-arrow');
        this._setFromTypeVars(json.FromType);
        this.fromNode.addLine(this);
        this.toNode.addLine(this);
        this._setEvent();
        this.render();
    }
    _setFromTypeVars(fromType) {
        fromType = fromType || this.FromTypeAuto;
        this.fromType = fromType;
        this.isFromTypeV = (fromType === this.FromTypeV);
        this.isFromTypeH = (fromType === this.FromTypeH);
        const dom = this.path.node;
        if (fromType === this.FromTypeAuto) {
            dom.classList.remove('xf-way');
        }
        else {
            dom.classList.add('xf-way');
        }
    }
    _setEvent() {
        this.path2.node.addEventListener(MouseEstr.RightMenu, (event) => {
            event.preventDefault();
            if (this.flowView.fnShowMenu) {
                this.flowView.fnShowMenu(event, false, this);
            }
        });
    }
    setLabel(label) {
        this.labelElm.text(label);
    }
    render() {
        const fromPos = this.fromNode.getPos();
        const fromSize = this.fromNode.getSize();
        const fromCnt = { x: fromPos.x + fromSize.w / 2, y: fromPos.y + fromSize.h / 2 };
        const fromUp = { x: fromPos.x + fromSize.w / 2, y: fromPos.y };
        const fromDown = { x: fromPos.x + fromSize.w / 2, y: fromPos.y + fromSize.h };
        const fromLeft = { x: fromPos.x, y: fromPos.y + fromSize.h / 2 };
        const fromRight = { x: fromPos.x + fromSize.w, y: fromPos.y + fromSize.h / 2 };
        const toPos = this.toNode.getPos();
        const toSize = this.toNode.getSize();
        const toCnt = { x: toPos.x + toSize.w / 2, y: toPos.y + toSize.h / 2 };
        const toUp = { x: toPos.x + toSize.w / 2, y: toPos.y };
        const toDown = { x: toPos.x + toSize.w / 2, y: toPos.y + toSize.h };
        const toLeft = { x: toPos.x, y: toPos.y + toSize.h / 2 };
        const toRight = { x: toPos.x + toSize.w, y: toPos.y + toSize.h / 2 };
        const isToRight = toCnt.x > fromCnt.x;
        const isToDown = toCnt.y > fromCnt.y;
        const cntCntSize = { w: Math.abs(fromCnt.x - toCnt.x), h: Math.abs(fromCnt.y - toCnt.y) };
        const isMaxCntCnt1H = cntCntSize.w <= this.MaxCntCnt1;
        const isMaxCntCnt1V = cntCntSize.h <= this.MaxCntCnt1;
        const isMinSideCnt2H = cntCntSize.w - fromSize.w / 2 >= this.MinSideCnt2;
        const isMinSideCnt2V = cntCntSize.h - toSize.h / 2 >= this.MinSideCnt2;
        const isMinCntSide2H = cntCntSize.w - toSize.w / 2 >= this.MinSideCnt2;
        const isMinCntSide2V = cntCntSize.h - fromSize.h / 2 >= this.MinSideCnt2;
        const sideSideH = (isToRight ? toLeft.x - fromRight.x : fromLeft.x - toRight.x);
        const sideSideV = (isToDown ? toUp.y - fromDown.y : fromUp.y - toDown.y);
        const isMinSideSide1H = sideSideH >= this.MinSideSide13;
        const isMinSideSide1V = sideSideV >= this.MinSideSide13;
        const isMinSideSide3H = sideSideH >= this.MinSideSide13 * 2;
        const isMinSideSide3V = sideSideV >= this.MinSideSide13 * 2;
        const isMinCntCnt3H = (isToRight ? toLeft.x - fromRight.x : fromLeft.x - toRight.x) >= this.MinCntCnt3;
        const isMinCntCnt3V = (isToDown ? toUp.y - fromDown.y : fromUp.y - toDown.y) >= this.MinCntCnt3;
        let fromPnt, toPnt;
        let points;
        let textStartAry = 0;
        if (!this.isFromTypeH && isMaxCntCnt1H && isMinSideSide1V) {
            fromPnt = isToDown ? fromDown : fromUp;
            toPnt = isToDown ? toUp : toDown;
            points = [fromPnt, { x: fromPnt.x, y: toPnt.y }];
        }
        else if (!this.isFromTypeV && isMaxCntCnt1V && isMinSideSide1H) {
            fromPnt = isToRight ? fromRight : fromLeft;
            toPnt = isToRight ? toLeft : toRight;
            points = [fromPnt, { x: toPnt.x, y: fromPnt.y }];
        }
        else if (!this.isFromTypeV && isMinSideCnt2H && isMinCntSide2V) {
            fromPnt = isToRight ? fromRight : fromLeft;
            toPnt = isToDown ? toUp : toDown;
            points = [fromPnt, { x: toPnt.x, y: fromPnt.y }, toPnt];
            textStartAry = 1;
        }
        else if (!this.isFromTypeH && isMinSideCnt2V && isMinCntSide2H) {
            fromPnt = isToDown ? fromDown : fromUp;
            toPnt = isToRight ? toLeft : toRight;
            points = [fromPnt, { x: fromPnt.x, y: toPnt.y }, toPnt];
        }
        else if (!this.isFromTypeH && isMinSideSide3V && isMinCntCnt3V) {
            fromPnt = isToDown ? fromDown : fromUp;
            toPnt = isToDown ? toUp : toDown;
            let midY = (fromPnt.y + toPnt.y) / 2;
            points = [fromPnt, { x: fromPnt.x, y: midY }, { x: toPnt.x, y: midY }, toPnt];
        }
        else if (!this.isFromTypeV && isMinSideSide3H && isMinCntCnt3H) {
            fromPnt = isToRight ? fromRight : fromLeft;
            toPnt = isToRight ? toLeft : toRight;
            let midX = (fromPnt.x + toPnt.x) / 2;
            points = [fromPnt, { x: midX, y: fromPnt.y }, { x: midX, y: toPnt.y }, toPnt];
            textStartAry = 1;
        }
        else if (!this.isFromTypeH && isMinCntCnt3H) {
            let midY = isToDown ? Math.max(fromDown.y, toDown.y) + this.MinSideSide13 : Math.min(fromUp.y, toUp.y) - this.MinSideSide13;
            fromPnt = isToDown ? fromDown : fromUp;
            toPnt = isToDown ? toDown : toUp;
            points = [fromPnt, { x: fromPnt.x, y: midY }, { x: toPnt.x, y: midY }, toPnt];
        }
        else if (!this.isFromTypeV && isMinCntCnt3V) {
            let midX = isToRight ? Math.max(fromRight.x, toRight.x) + this.MinSideSide13 : Math.min(fromLeft.x, toLeft.x) - this.MinSideSide13;
            fromPnt = isToRight ? fromRight : fromLeft;
            toPnt = isToRight ? toRight : toLeft;
            points = [fromPnt, { x: midX, y: fromPnt.y }, { x: midX, y: toPnt.y }, toPnt];
            textStartAry = 1;
        }
        else {
            if (isToDown) {
                fromPnt = !this.isFromTypeH ? fromDown : (isToRight ? fromRight : fromLeft);
                toPnt = isToRight ? toLeft : toRight;
            }
            else {
                fromPnt = !this.isFromTypeH ? fromUp : (isToRight ? fromRight : fromLeft);
                toPnt = isToRight ? toLeft : toRight;
            }
            points = [fromPnt, toPnt];
        }
        this._drawLine(points);
        this.labelElm.center((points[textStartAry].x + points[textStartAry + 1].x) / 2, (points[textStartAry].y + points[textStartAry + 1].y) / 2);
    }
    _drawLine(points) {
        let pathStr = `M ${points[0].x} ${points[0].y}`;
        const pntLen = points.length;
        const radius = this.MaxCntCnt1;
        for (let i = 1; i < pntLen; i++) {
            const prevPnt = points[i - 1];
            const nowPnt = points[i];
            if (i < pntLen - 1) {
                const nextPnt = points[i + 1];
                const vec1 = { x: nowPnt.x - prevPnt.x, y: nowPnt.y - prevPnt.y };
                const vec2 = { x: nextPnt.x - nowPnt.x, y: nextPnt.y - nowPnt.y };
                const len1 = Math.sqrt(Math.pow(vec1.x, 2) + Math.pow(vec1.y, 2));
                const len2 = Math.sqrt(Math.pow(vec2.x, 2) + Math.pow(vec2.y, 2));
                const unitVec1 = { x: vec1.x / len1, y: vec1.y / len1 };
                const unitVec2 = { x: vec2.x / len2, y: vec2.y / len2 };
                const arcStartX = nowPnt.x - unitVec1.x * radius;
                const arcStartY = nowPnt.y - unitVec1.y * radius;
                const arcEndX = nowPnt.x + unitVec2.x * radius;
                const arcEndY = nowPnt.y + unitVec2.y * radius;
                pathStr += ` L ${arcStartX} ${arcStartY}`;
                const cross = unitVec1.x * unitVec2.y - unitVec1.y * unitVec2.x;
                const sweepFlag = cross < 0 ? 0 : 1;
                pathStr += ` A ${radius} ${radius} 0 0 ${sweepFlag} ${arcEndX} ${arcEndY}`;
            }
            else {
                pathStr += ` L ${nowPnt.x} ${nowPnt.y}`;
            }
        }
        this.path.plot(pathStr);
        this.path2.plot(pathStr);
        this._drawArrow(points[pntLen - 2], points[pntLen - 1]);
    }
    _drawArrow(fromPnt, toPnt) {
        const angle = Math.atan2(toPnt.y - fromPnt.y, toPnt.x - fromPnt.x);
        const arrowPnt1 = {
            x: toPnt.x - this.ArrowLen * Math.cos(angle) + this.ArrowWidth * Math.cos(angle - Math.PI / 2),
            y: toPnt.y - this.ArrowLen * Math.sin(angle) + this.ArrowWidth * Math.sin(angle - Math.PI / 2)
        };
        const arrowPnt2 = {
            x: toPnt.x - this.ArrowLen * Math.cos(angle) + this.ArrowWidth * Math.cos(angle + Math.PI / 2),
            y: toPnt.y - this.ArrowLen * Math.sin(angle) + this.ArrowWidth * Math.sin(angle + Math.PI / 2)
        };
        this.arrow.plot(`M ${toPnt.x} ${toPnt.y} L ${arrowPnt1.x} ${arrowPnt1.y} M ${toPnt.x} ${toPnt.y} L ${arrowPnt2.x} ${arrowPnt2.y}`);
    }
    getId() {
        return this.json.Id;
    }
    getFromType() {
        return this.json.FromType;
    }
    setFromType(fromType) {
        if (fromType === this.json.FromType)
            return;
        this._setFromTypeVars(fromType);
        this.render();
    }
}

import Mustache from "mustache";
import _Form from './_Form';
import _Obj from './_Obj';
import _Str from './_Str';
import _iSelect from './_iSelect';
import _iText from './_iText';
import _Modal from './_Modal';
import _iRead from './_iRead';
import _Tool from './_Tool';
import _Fun from './_Fun';
import FlowView from './FlowView';
import NodeTypeEstr from '../Enums/NodeTypeEstr';
import MouseEstr from '../Enums/MouseEstr';
export default class FlowMany {
    OrSep = '{O}';
    AndSep = '{A}';
    ColSep = ',';
    FtMenu = '.xf-menu';
    FtStartNode = '.xf-start';
    InitLineCfg = { stroke: 'blue', strokeWidth: 2 };
    isEdit = false;
    mNode;
    mLine;
    divLinesBox;
    eformNodes;
    eformLines;
    modalNodeProp;
    modalLineProp;
    eformNodeProp;
    tbodyLineCond;
    tplNode;
    tplLine;
    tplLineCond;
    nowIsNode = false;
    nowFlowItem = null;
    condOpExprs = [];
    condOpShows = [];
    flowView;
    constructor(areaId, mNode, mLine) {
        this.mNode = mNode;
        this.mLine = mLine;
        this.divLinesBox = $('#divLinesBox');
        this.eformNodes = $('#eformNodes');
        this.eformLines = $('#eformLines');
        this.modalNodeProp = $('#modalNodeProp');
        this.modalLineProp = $('#modalLineProp');
        this.eformNodeProp = this.modalNodeProp.find('form');
        this.tbodyLineCond = this.modalLineProp.find('tbody');
        this.tplNode = $('#tplNode').html();
        this.tplLine = $('#tplLine').html();
        this.tplLineCond = $('#tplLineCond').html();
        const condOpMaps = [
            this.OrSep, ') || (',
            this.AndSep, ' && ',
            ',EQ,', '=',
            ',NEQ,', '!=',
            ',GT,', '>',
            ',GE,', '>=',
            ',ST,', '<',
            ',SE,', '<=',
        ];
        let j = 0;
        for (let i = 0; i < condOpMaps.length; i = i + 2) {
            this.condOpExprs[j] = new RegExp(condOpMaps[i], 'g');
            this.condOpShows[j] = condOpMaps[i + 1];
            j++;
        }
        const flowView = new FlowView(areaId);
        flowView.fnMoveNode = (node, x, y) => this.fnMoveNode(node, x, y);
        flowView.fnAfterAddLine = (json) => this.fnAfterAddLine(json);
        flowView.fnShowMenu = (event, isNode, flowItem) => this.fnShowMenu(event, isNode, flowItem);
        this.flowView = flowView;
        this._setFlowEvent();
    }
    fnMoveNode(node, x, y) {
        const rowBox = this.mNode.idToRowBox(node.getId());
        _Form.loadRow(rowBox, { PosX: Math.floor(x), PosY: Math.floor(y) });
    }
    fnAfterAddLine(json) {
        this.mLine.addRow(json, null, json.Id);
    }
    fnShowMenu(event, isNode, flowItem) {
        this.nowIsNode = isNode;
        this.nowFlowItem = flowItem;
        const canEdit = isNode
            ? (this.isEdit && flowItem.getNodeType() == NodeTypeEstr.Node)
            : this.isEdit;
        const css = 'off';
        const menu = $(this.FtMenu);
        if (canEdit) {
            menu.find('.xd-edit').removeClass(css);
            menu.find('.xd-delete').removeClass(css);
        }
        else {
            menu.find('.xd-edit').addClass(css);
            menu.find('.xd-delete').addClass(css);
        }
        menu.finish()
            .removeClass('d-none')
            .css({
            position: 'fixed',
            left: event.clientX + 'px',
            top: event.clientY + 'px',
        });
    }
    reset() {
        this.flowView.reset();
    }
    setEdit(status) {
        this.isEdit = status;
        this.flowView.setEdit(status);
    }
    _setFlowEvent() {
        const me = this;
        $(document).on(MouseEstr.MouseDown, function (e) {
            const filter = me.FtMenu;
            if ($(e.target).closest(filter).length === 0)
                _Obj.hide($(filter));
        });
    }
    loadNodes(rows) {
        this.mNode.loadRowsByRsb(rows, true);
        this.flowView.loadNodes(rows);
    }
    loadLines(rows) {
        this.mLine.loadRowsByRsb(rows, true);
        if (rows != null) {
            for (let i = 0; i < rows.length; i++) {
                rows[i].Label = this._condStrToLabel(rows[i].CondStr);
            }
        }
        this.flowView.loadLines(rows);
    }
    addNode(nodeType, name) {
        let nodeName = name || '';
        if (nodeType == NodeTypeEstr.Start) {
            nodeName = 'S';
        }
        else if (nodeType == NodeTypeEstr.End) {
            nodeName = 'E';
        }
        else {
            nodeName = '節點-' + this.flowView.getNewNodeId();
        }
        const json = {
            Name: nodeName,
            NodeType: nodeType,
            PosX: 100,
            PosY: 100,
        };
        const row = this.mNode.addRow(json);
        this.flowView.addNode(row);
    }
    deleteNode(node) {
        this.mNode.deleteRow(node.getId());
        node.getLines().forEach((line) => {
            this.mLine.deleteRow(line.getId());
        });
        this.flowView.deleteNode();
    }
    deleteLine(line) {
        this.mLine.deleteRow(line.getId());
        this.flowView.deleteLine(line);
    }
    _condStrToLabel(str) {
        if (_Str.isEmpty(str))
            return '';
        const hasOr = str.indexOf(this.OrSep) > 0;
        for (let i = 0; i < this.condOpExprs.length; i++)
            str = str.replace(this.condOpExprs[i], this.condOpShows[i]);
        if (hasOr)
            str = '(' + str + ')';
        return str;
    }
    _condStrToList(str) {
        if (_Str.isEmpty(str))
            return null;
        const orList = str.split(this.OrSep);
        const orLen = orList.length;
        const hasOr = (orLen > 1);
        const result = [];
        let ary = 0;
        for (let i = 0; i < orLen; i++) {
            const andList = orList[i].split(this.AndSep);
            for (let j = 0; j < andList.length; j++) {
                const cols = andList[j].split(this.ColSep);
                result[ary] = {
                    AndOr: hasOr ? this.OrSep : this.AndSep,
                    Fid: cols[0],
                    Op: cols[1],
                    Value: cols[2],
                };
                ary++;
            }
        }
        return result;
    }
    _getCondStr() {
        const me = this;
        let condStr = '';
        this.tbodyLineCond.find('tr').each(function (idx) {
            const tr = $(this);
            const str = (idx == 0 ? '' : _iSelect.get('AndOr', tr)) +
                _iText.get('Fid', tr) + me.ColSep +
                _iSelect.get('Op', tr) + me.ColSep +
                _iText.get('Value', tr);
            condStr += str;
        });
        return condStr;
    }
    showNodeProp(node) {
        const rowBox = this.mNode.idToRowBox(node.getId());
        _Form.loadRow(this.modalNodeProp, _Form.toRow(rowBox));
        _Modal.show(this.modalNodeProp);
    }
    showLineProp(line) {
        const rowBox = this.mLine.idToRowBox(line.getId());
        const form = this.modalLineProp.find('form');
        _iRead.set('FromNodeName', line.fromNode.getName(), form);
        _iRead.set('ToNodeName', line.toNode.getName(), form);
        _iSelect.set('FromType', line.getFromType(), form);
        _iText.set('Sort', _iText.get('Sort', rowBox), form);
        _Modal.show(this.modalLineProp);
        this.tbodyLineCond.empty();
        const condStr = _iText.get('CondStr', rowBox);
        const condList = this._condStrToList(condStr);
        if (condList != null) {
            for (let i = 0; i < condList.length; i++) {
                const newCond = $(this.tplLineCond);
                _Form.loadRow(newCond, condList[i]);
                this.tbodyLineCond.append(newCond);
            }
        }
    }
    onAddNode(nodeType) {
        if (nodeType == NodeTypeEstr.Start && this.flowView.hasStartNode()) {
            _Tool.msg('起始節點已經存在，不可再新增。');
            return;
        }
        this.addNode(nodeType);
    }
    _menuStatus(me) {
        return !me[0].classList.contains('off');
    }
    onMenuEdit() {
        const me = _Fun.getMe();
        if (!this._menuStatus(me))
            return;
        if (this.nowIsNode)
            this.showNodeProp(this.nowFlowItem);
        else
            this.showLineProp(this.nowFlowItem);
    }
    onMenuDelete() {
        const me = _Fun.getMe();
        if (!this._menuStatus(me))
            return;
        const the = this;
        if (the.nowIsNode) {
            _Tool.ans('是否確定刪除這個節點和流程線?', function () {
                the.deleteNode(the.nowFlowItem);
            });
        }
        else {
            _Tool.ans('是否確定刪除這一條流程線?', function () {
                the.deleteLine(the.nowFlowItem);
            });
        }
    }
    onMenuView() {
        // todo
    }
    onAddLineCond() {
        const row = {
            AndOr: this.AndSep,
            Op: 'eq',
        };
        const cond = $(Mustache.render(this.tplLineCond, row));
        _Form.loadRow(cond, row);
        this.tbodyLineCond.append(cond);
    }
    onDeleteLineCond(btn) {
        $(btn).closest('tr').remove();
    }
    onModalNodeOk() {
        const row = _Form.toRow(this.eformNodeProp);
        const node = this.nowFlowItem;
        const rowBox = this.mNode.idToRowBox(node.getId());
        const oldName = _iText.get('Name', rowBox);
        _Form.loadRow(rowBox, row);
        if (oldName != row.Name)
            node.setName(row.Name, true);
        _Modal.hide(this.modalNodeProp);
    }
    onModalLineOk() {
        const modal = this.modalLineProp;
        const row = {
            CondStr: this._getCondStr(),
            Sort: _iText.get('Sort', modal),
            FromType: _iSelect.get('FromType', modal),
        };
        const line = this.nowFlowItem;
        const rowBox = this.mLine.idToRowBox(line.getId());
        _Form.loadRow(rowBox, row);
        line.setLabel(this._condStrToLabel(row.CondStr));
        line.setFromType(row.FromType);
        _Modal.hide(modal);
    }
}

import NodeTypeEstr from '../Enums/NodeTypeEstr';
import MouseEstr from '../Enums/MouseEstr';
import _Str from './_Str';
export default class FlowNode {
    MinWidth = 80;
    MinHeight = 42;
    LineHeight = 18;
    PadTop = 8;
    PadLeft = 15;
    PinWidth = 12;
    PinGap = 3;
    NodeRadius = 20;
    NodeRx = 5;
    self;
    flowView;
    svg;
    json;
    elm;
    boxElm;
    nameElm;
    pinElm;
    lines;
    constructor(flowView, json) {
        this.self = this;
        this.flowView = flowView;
        this.svg = flowView.svg;
        this.json = Object.assign({
            Name: 'Node',
            NodeType: NodeTypeEstr.Node,
            PosX: json.PosX || 100,
            PosY: json.PosY || 100,
        }, json);
        this.lines = [];
        let nodeType = this.json.NodeType;
        let cssClass = '';
        let nodeText = '';
        this.elm = this.svg
            .group()
            .attr('data-id', json.Id);
        let startEnd = this._isStartEnd();
        if (startEnd) {
            if (nodeType == NodeTypeEstr.Start) {
                cssClass = 'xf-start';
                nodeText = NodeTypeEstr.Start;
            }
            else {
                cssClass = 'xf-end';
                nodeText = NodeTypeEstr.End;
            }
            this.boxElm = this.elm.circle()
                .addClass(cssClass);
            this.boxElm.attr('r', this.NodeRadius);
            this.nameElm = this.elm.text(nodeText)
                .addClass(cssClass + '-text')
                .attr({ 'text-anchor': 'middle', 'dominant-baseline': 'middle' });
        }
        else {
            nodeText = this.json.Name;
            cssClass = 'xf-node';
            this.boxElm = this.elm.rect()
                .addClass(cssClass)
                .attr({
                'text-anchor': 'middle',
                'dominant-baseline': 'middle',
                'rx': this.NodeRx,
                'ry': this.NodeRx,
            });
            this.nameElm = this.elm.text('')
                .addClass(cssClass + '-text');
            this.setName(nodeText, false);
        }
        this.elm.move(this.json.PosX, this.json.PosY);
        if (nodeType != NodeTypeEstr.End) {
            this.pinElm = this.elm
                .rect(this.PinWidth, this.PinWidth)
                .addClass('xf-pin');
            this._setPinPos();
        }
        this._setEvent();
    }
    getLines() {
        return this.lines;
    }
    _isStartEnd() {
        return (this.json.NodeType == NodeTypeEstr.Start || this.json.NodeType == NodeTypeEstr.End);
    }
    getNodeType() {
        return this.json.NodeType;
    }
    getPos() {
        let elm = this.elm;
        return { x: elm.x(), y: elm.y() };
    }
    getSize() {
        let elm = this.boxElm;
        return { w: elm.width(), h: elm.height() };
    }
    getCenter() {
        let elm = this.boxElm;
        return { x: elm.cx(), y: elm.cy() };
    }
    _setPinPos() {
        if (!this.pinElm)
            return;
        let bbox = this.nameElm.bbox();
        let center = this.getCenter();
        this.pinElm.move(center.x + bbox.width / 2 + 3, center.y - 5);
    }
    _setEvent() {
        let me = this;
        let flowView = this.flowView;
        this.elm.node.addEventListener(MouseEstr.RightMenu, function (e) {
            e.preventDefault();
            if (flowView.fnShowMenu)
                flowView.fnShowMenu(e, true, me);
        });
        this.elm.draggable().on(MouseEstr.DragMove, function (e) {
            if (!flowView.isEdit)
                return;
            me._drawLines();
        }).on(MouseEstr.DragEnd, function (e) {
            if (!flowView.isEdit)
                return;
            let { x, y } = e.detail.box;
            if (me.flowView.fnMoveNode)
                me.flowView.fnMoveNode(me, x, y);
        });
        this._setEventPin();
    }
    _drawLines() {
        this.lines.forEach(line => line.render());
    }
    _setEventPin() {
        if (!this.pinElm)
            return;
        let fromDom, startX, startY;
        let tempLine;
        let toElm = null;
        let me = this;
        let flowView = this.flowView;
        this.pinElm.draggable().on(MouseEstr.DragStart, (event) => {
            if (!flowView.isEdit)
                return;
            let { x, y } = me.pinElm.rbox(me.svg);
            startX = x;
            startY = y;
            fromDom = me.self.elm.node;
            tempLine = me.svg.line(startX, startY, startX, startY)
                .addClass('xf-line off');
            flowView.drawLineStart(me.self);
        }).on(MouseEstr.DragMove, (event) => {
            if (!flowView.isEdit)
                return;
            event.preventDefault();
            let { x, y } = event.detail.box;
            let endX = x;
            let endY = y;
            tempLine.plot(startX, startY, endX, endY);
            if (isFinite(endX) && isFinite(endY)) {
                let svgRect = me.svg.node.getBoundingClientRect();
                let viewPortX = endX + svgRect.x;
                let viewPortY = endY + svgRect.y;
                let overDom = document.elementsFromPoint(viewPortX, viewPortY)
                    .find((dom) => dom != fromDom && (dom.classList.contains('xf-node') || dom.classList.contains('xf-end')));
                if (overDom) {
                    let overElm = overDom.instance;
                    if (toElm !== overElm) {
                        if (toElm)
                            me._markNode(toElm, false);
                        toElm = overElm;
                        me._markNode(toElm, true);
                    }
                }
                else if (toElm) {
                    me._markNode(toElm, false);
                    toElm = null;
                }
            }
        }).on(MouseEstr.DragEnd, (event) => {
            if (!flowView.isEdit)
                return;
            if (toElm) {
                me._markNode(toElm, false);
                let id = toElm.parent().node.dataset.id;
                let json = flowView.drawLineEnd(flowView.idToNode(id));
                toElm = null;
                if (flowView.fnAfterAddLine)
                    flowView.fnAfterAddLine(json);
            }
            tempLine.remove();
        });
    }
    _markNode(elm, status) {
        if (status) {
            elm.node.classList.add('on');
        }
        else {
            elm.node.classList.remove('on');
        }
    }
    getId() {
        return this.json.Id;
    }
    addLine(line) {
        this.lines.push(line);
    }
    deleteLine(line) {
        let index = this.lines.findIndex((item) => item.Id == line.Id);
        this.lines.splice(index, 1);
    }
    getName() {
        return this.nameElm.text();
    }
    setName(name, drawLine) {
        let lines = _Str.replaceAll(name, '\\n', '\n').split('\n');
        this.nameElm.clear().text((add) => {
            lines.forEach((line, i) => {
                if (i > 0)
                    add.tspan(line).newLine().dy(this.LineHeight);
                else
                    add.tspan(line);
            });
        });
        const bbox = this.nameElm.bbox();
        let width = Math.max(this.MinWidth, bbox.width + this.PadLeft * 2 + this.PinWidth + this.PinGap * 2);
        let height = Math.max(this.MinHeight, bbox.height + this.PadTop * 2);
        this.boxElm.size(Math.round(width), Math.round(height));
        this.nameElm.center(this.boxElm.cx(), this.boxElm.cy());
        if (drawLine)
            this._drawLines();
    }
}

import FlowNode from './FlowNode';
import FlowLine from './FlowLine';
import NodeTypeEstr from '../Enums/NodeTypeEstr';
/**
 * FlowBase -> FlowView
 * 建立 FlowView 簡化外部程式, 考慮模組化, 所以不使用jQuery
 * 自定函數如下(由flow內部觸發):
 * void fnMoveNode(node, x, y): after move node to (x,y)
 * void fnAfterAddLine(json): when add line
 * void fnShowMenu(isNode, flowItem, event);
 * void fnAfterMoveLineEnd(oldNode, newNode): after drop line end point
 */
// 假設 NodeTypeEstr, MouseEstr, _str, SVG, FlowNode, FlowLine 為外部定義或引入
// declare var NodeTypeEstr: any;
// declare var MouseEstr: any;
// declare var _str: any;
// declare var SVG: any;
export default class FlowView {
    isEdit = false;
    newNodeId = 0;
    newLineId = 0;
    svg;
    nodes = [];
    lines = [];
    fromNode = null;
    fnMoveNode = null;
    fnAfterAddLine = null;
    fnShowMenu = null;
    constructor(boxId) {
        let boxDom = document.getElementById(boxId);
        this.svg = window.SVG().addTo(boxDom).size('100%', '100%');
    }
    getNewNodeId() {
        this.newNodeId++;
        return this.newNodeId;
    }
    getNewLineId() {
        this.newLineId--;
        return this.newLineId;
    }
    setEdit(status) {
        this.isEdit = status;
    }
    reset() {
        this.nodes = [];
        this.lines = [];
        this.fromNode = null;
        Array.from(this.svg.node.childNodes).forEach((node) => {
            node.remove();
        });
    }
    loadNodes(rows) {
        this.reset();
        for (let i = 0; i < rows.length; i++) {
            this.addNode(rows[i]);
        }
    }
    loadLines(rows) {
        if (rows != null) {
            for (let i = 0; i < rows.length; i++) {
                this.addLine(rows[i]);
            }
        }
    }
    addNode(json) {
        let node = new FlowNode(this, json);
        this.nodes.push(node);
        return node;
    }
    addLine(json) {
        return new FlowLine(this, json);
    }
    deleteNode(node) {
        let id = node.getId();
        this.svg.findOne(`g[data-id="${id}"]`).remove();
    }
    deleteLine(line) {
        let id = line.getId();
        this.svg.find(`path[data-id="${id}"]`).remove();
    }
    drawLineStart(fromNode) {
        this.fromNode = fromNode;
    }
    drawLineEnd(toNode) {
        let json = {
            Id: this.newLineId,
            FromNodeId: this.fromNode.getId(),
            ToNodeId: toNode.getId(),
        };
        new FlowLine(this, json, this.fromNode, toNode);
        this.fromNode = null;
        return json;
    }
    idToNode(id) {
        return this.nodes.find(node => node.getId() == id);
    }
    hasStartNode() {
        return this.nodes.some(node => node.getNodeType() == NodeTypeEstr.Start);
    }
}

import _Var from './_Var';
import _Obj from './_Obj';
import _Tool from './_Tool';
import _Str from './_Str';
import _Html from './_Html';
export default class Page {
    pager;
    linker;
    action;
    showMenu;
    pageRowList;
    pageArg;
    constructor(config) {
        this.pager = config.pager;
        this.linker = config.linker;
        this.action = config.action;
        this.showMenu = config.showMenu || _Var.notEmpty(config.pageRowList);
        this.pageRowList = config.pageRowList || [10, 25, 50, 100];
        this._init(config.pageStr, config.onFind);
    }
    _init(pageStr, onFind) {
        this.pageArg = this._getPageArg(pageStr);
        const arg = this.pageArg;
        const pager = this.pager;
        if (arg.filterRows <= 0) {
            _Obj.hide(pager);
            _Tool.msg(_BR.FindNone);
            return;
        }
        let menu = '';
        if (this.showMenu) {
            const cols = _BR.Page.split('@@');
            menu = cols[0].replace('_Menu', this._getMenuHtml());
            const start = (arg.pageNo - 1) * arg.pageRows + 1;
            const end = start + arg.pageRows - 1;
            const info = cols[1]
                .replace('_Start', start.toString())
                .replace('_End', (end <= arg.filterRows ? end : arg.filterRows).toString())
                .replace('_Total', arg.filterRows.toString());
            menu = _Str.format("<div class='x-page-menu'><label>{0}<span>{1}</span></label></div>", menu, info);
        }
        pager.html(menu + "<div class='x-page-btns'></div>");
        pager.find('select').on('change', () => {
            if (onFind)
                onFind();
        });
        pager.find('.x-page-btns').pagination({
            currentPage: arg.pageNo,
            itemsOnPage: arg.pageRows,
            items: arg.filterRows,
            listStyle: 'pagination ' + (this.showMenu ? 'x-has-menu' : 'x-no-menu'),
            prevText: "<",
            nextText: ">",
            onPageClick: onFind,
        });
    }
    _getMenuHtml() {
        let menu = "<select class='form-select x-inline x-w100'>";
        for (let i = 0; i < this.pageRowList.length; i++) {
            menu += _Str.format("<option value='{0}'{1}>{0}</option>", this.pageRowList[i], this.pageArg.pageRows == this.pageRowList[i] ? ' selected' : '');
        }
        menu += "</select>";
        return menu;
    }
    _getPageArg(pageStr) {
        const json = JSON.parse(_Html.decode(pageStr));
        return {
            pageNo: json['pageNo'] || 1,
            pageRows: json['pageRows'] || 0,
            filterRows: json['filterRows'] ?? -1
        };
    }
    find(json = {}, page) {
        const arg = this.pageArg;
        if (_Var.isEmpty(page)) {
            arg.pageNo = 1;
            arg.filterRows = -1;
            arg.pageRows = parseInt(this.pager.find('select').val());
        }
        else {
            arg.pageNo = page;
        }
        let url = this.action +
            '?page=' + arg.pageNo +
            '&rows=' + arg.pageRows +
            '&filter=' + arg.filterRows;
        for (const key in json) {
            if (_Str.notEmpty(json[key])) {
                url += '&' + key + '=' + json[key];
            }
        }
        if (_Obj.isEmpty(this.linker)) {
            window.location.href = url;
        }
        else {
            this.linker.attr('href', url);
            this.linker.trigger('click');
        }
    }
}

import _Var from './_Var';
import _Fun from './_Fun';
import _Jwt from './_Jwt';
import _Str from './_Str';
import _Tool from './_Tool';
export default class _Ajax {
    /** * ajax return json
     * param url {string} action url
     * param data {json} property should be string !!
     * param fnOk {function} (optional) callback function
     * param block {bool} block ui or not, default true
     * return {bool/json}
     */
    static async getJsonA(url, data, fnOk, block) {
        const json = {
            url: url,
            type: 'POST',
            data: data,
            dataType: 'json', //return type: ContentType,JsonResult
        };
        return await _Ajax._rpcA(json, fnOk, block);
    }
    /**
     * ajax return json by FormData(Fd), for upload file
     * param url {string}
     * param data {FormData}
     * param fnOk {function} (optional) callback function
     * param block {bool} block ui or not, default true
     * return {bool/json}
     */
    static async getJsonByFdA(url, data, fnOk, block) {
        const json = {
            url: url,
            type: 'POST',
            data: data,
            dataType: 'json', //return type, TODO: pending test
            cache: false,
            contentType: false, //false!! input type, default 'application/x-www-form-urlencoded; charset=UTF-8'
            processData: false, //false!! (jQuery only) if true it will convert input data to string, then get error !!
        };
        return await _Ajax._rpcA(json, fnOk, block);
    }
    /**
     * ajax return string
     * param fnOk {function} (optional) callback function
     * param block {bool} block ui or not, default true
     * return {bool/string}
     */
    static async getStrA(url, data, fnOk, block) {
        const json = {
            url: url,
            type: 'POST',
            data: data,
            dataType: 'text', //backend return text(ContentResult with text)
        };
        return await _Ajax._rpcA(json, fnOk, block);
    }
    static async getIntA(url, data, fnOk, block) {
        const json = {
            url: url,
            type: 'POST',
            data: data,
            dataType: 'text', //backend return text(ContentResult with text)
        };
        return await _Ajax._rpcA(json, fnOk, block);
    }
    /**
     * ajax return html string
     * param fnOk {function} (optional) callback function
     * param block {bool} block ui or not, default true
     * return {bool/html string}
     */
    static async getViewA(url, data, fnOk, block) {
        const json = {
            url: url,
            type: 'POST',
            data: data,
            dataType: 'html',
        };
        return await _Ajax._rpcA(json, fnOk, block);
    }
    /**
     * 使用fetch, 將來考慮取代jquery ajax
     * GET ok, 但是 POST 有問題(所以用GET) !!
     * param url {string} action url
     * param data {json} 傳入參數
     * param elm {element} 如果是XiFile欄位則此參數為必要
     * param fnOk {function} 目前無作用
     * return {file/string(錯誤訊息)/空白(檔案不存在)}
     */
    static async getFileA(url, data, elm, fnOk) {
        const args = new URLSearchParams(data);
        const resp = await fetch(`${url}?${args}`);
        if (resp.ok) {
            //blob
            const blob = await resp.blob();
            const contentType = resp.headers.get('Content-Type');
            const isImage = contentType && contentType.startsWith('image/');
            //get下載檔名 if any
            let downName = 'download';
            if (elm == null) {
                const disposition = resp.headers.get('Content-Disposition');
                if (disposition) {
                    //1.優先抓 filename* (RFC 5987, UTF-8)
                    let match = disposition.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);
                    if (match && match[1]) {
                        downName = decodeURIComponent(match[1]);
                    }
                    else {
                        //2.fallback: filename=
                        match = disposition.match(/filename\s*=\s*"?([^\";]+)"?/i);
                        if (match && match[1]) {
                            downName = match[1];
                        }
                    }
                }
            }
            else {
                downName = elm.innerText;
            }
            //圖檔直接顯示, 其他則下載
            if (isImage) {
                const imageUrl = URL.createObjectURL(blob);
                _Tool.showImage(downName, imageUrl);
            }
            else {
                const a = document.createElement('a');
                const downUrl = URL.createObjectURL(blob);
                a.href = downUrl;
                a.download = downName;
                document.body.appendChild(a);
                a.click();
                //清理
                a.remove();
                URL.revokeObjectURL(downUrl);
            }
        }
        else {
            //無錯誤訊息表示檔案不存在(後端傳回null)
            let error = await resp.text();
            if (_Var.isEmpty(error)) {
                error = _BR.NoFile;
            }
            _Tool.msg(error);
        }
    }
    /**
     * ajax call(private), only return success info(include custom message)
     * 使用 async/await 傳回值 for caller 判斷執行結果是否成功
     * param json {json} ajax json
     * param fnOk {function} (optional) callback function
     * //param fnError {function} (optional) callback function
     * param block {bool/object} block ui or not, default true
     * //如果要block modal, 必須傳入 modal object !!
     * return {bool/json/any} ResultDto return null when error
     * bool: fnOk not empty, return false when error
     * json/any: fnOk is empty, return null when error
     */
    static async _rpcA(json, fnOk, block) {
        if (_Var.isEmpty(block))
            block = true;
        if (block)
            _Fun.block(block);
        //改用 async/await
        let status = false;
        let result = null;
        try {
            _Jwt.jsonAddJwtHeader(json);
            result = await $.ajax(json);
            const errMsg = _Ajax.resultToErrMsg(result);
            //先判斷error msg
            if (_Str.notEmpty(errMsg)) {
                result = null; //reset here !!
                _Tool.msg(errMsg);
            }
            else if (result && result.ErrorRows && result.ErrorRows.length > 0) {
                //有欄位驗證錯誤, //todo: 多筆區域是否顯示正確?
                const errJson = {};
                for (let i = 0; i < result.ErrorRows.length; i++) {
                    const row = result.ErrorRows[i];
                    const edit = (row.EditNo == 0)
                        ? _me.edit0 : _me.crudE.getEditByNo(row.EditNo);
                    errJson[row.Fid] = row.Msg;
                    edit.validator.showErrors(errJson);
                }
                //todo: 考慮下載檔案
            }
            else if (fnOk) {
                fnOk(result);
                status = true;
            }
        }
        catch (error) {
            console.error(error);
        }
        if (block)
            _Fun.unBlock(block);
        return (fnOk == null) ? result : status;
    }
    /**
     * resultDto to error msg string
     * also called by Datatable.js
     * param result {ResultDto} error msg
     */
    static _isBrError(result) {
        return (result.length >= 2 && result.substring(0, 2) === _Fun.PreBrError);
    }
    /**
     * resultDto to error msg string
     * also called by Datatable.js
     * param result {ResultDto} error msg
     */
    static resultToErrMsg(result) {
        return (result && result[_Fun.FidErrorMsg])
            ? _Ajax.strToErrMsg(result[_Fun.FidErrorMsg])
            : '';
    }
    /**
     * result string to error msg if any
     */
    static strToErrMsg(str) {
        if (_Str.isEmpty(str))
            return '';
        if (!_Ajax._isBrError(str))
            return str;
        //case of BR error msg
        const fid = str.substring(2);
        return (_BR[fid])
            ? _BR[fid]
            : _Str.format('_Ajax.strToErrMsg() failed, no BR Fid={0}', fid);
    }
}

export default class _Array {
    /**
     * find array
     * @param ary {any[]} target array
     * @param id {number|string} find value
     * @returns {number} -1(not found), n
     */
    static find(ary, id) {
        if (ary == null)
            return -1;
        for (let i = 0; i < ary.length; i++) {
            if (ary[i] == id)
                return i;
        }
        return -1;
    }
    /**
     * convert array to string with separator
     * @param ary {any[]} source array
     * @param sep {string} separator, default to ','
     * @returns {string} ex: '1,2,3'
     */
    static toStr(ary, sep = ",") {
        return ary.join(sep);
    }
    static isEmpty(ary) {
        return (ary == null || ary.length == 0);
    }
    static notEmpty(ary) {
        return !_Array.isEmpty(ary);
    }
}

import _Error from './_Error';
export default class _Assert {
    static echo(msg) {
        _Error.log('_assert.js ' + msg);
    }
    //find array
    //return index
    static inArray(value, ary) {
        let find = false;
        for (const item in ary) {
            if (item == value) {
                find = true;
                break;
            }
        }
        if (!find)
            _Assert.echo('inArray failed: ' + value);
    }
}

export default class _Browser {
    // 傳到後端的語系code 欄位
    static _langCode = '_langCode';
    static pushState(url) {
        history.pushState(null, '', url);
    }
    /*
    //把語系code寫入 cookie (以後可改寫入 localeStorage)
    static setLang(lang: string): void {
        $.cookie(_Browser._langCode, lang);
    }

    static zz_print(id: string, fm?: any, fnCallback?: () => void): void {
        _Browser.zz_printO(_Obj.getById(id, fm, fnCallback));
    }
    */
    static zz_printO(obj, fnCallback) {
        window.print();
        /*
        debugger;
        //var me = _me;
        var body = document.body;
        var old = body.innerHTML;
        body.innerHTML = obj.html();
        window.print();
        body.innerHTML = old;
        //_me = me;
        //_me.divRead = $('#divRead');
        //if (fnCallback !== undefined)
        //    fnCallback();
        */
    }
}

export default class _Btn {
    static setEdit(obj, status) {
        obj.prop('disabled', !status);
    }
}

import { Chart } from "chart.js";
import _Json from './_Json';
export default class _Chart {
    //彩虹顏色
    static rainbowColors = [
        "#F32E37",
        "#EABE37",
        "#89E926",
        "#22E352",
        "#2FE5E8",
        "#295AE7",
        "#8828EE",
        "#E629B7",
    ];
    /**
     * show chart
     * param type {string} bar/pie/line
     * param canvasElm {object} canvas Object
     * param dto {model} Chart/ChartGroup, 可加入 config, 屬性datasets -> values !!
     * param percent {bool} show percentage(for pie,doughnut) or not
     */
    static _show(type, canvasElm, dto, legend = true, percent = false) {
        /*
    if (legend == null)
        legend = true;
    if (percent == null)
        percent = false;
        */
        //default config
        var isHbar = (type == 'hbar');
        var config = {
            type: isHbar ? 'bar' : type,
            data: {
                labels: dto.labels,
                /*
                datasets: dto.values,
                */
                datasets: [
                    {
                        //label: "Population (millions)",
                        //backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
                        data: dto.values,
                    }
                ]
            },
            options: {
                //多包一層plugins才能顯示title
                plugins: {
                    legend: {
                        position: 'bottom',
                        display: legend,
                    },
                    animation: {
                        animateScale: true,
                        animateRotate: true
                    },
                    title: {
                        display: true,
                        text: dto.title,
                        //class: 'xc-title',    //3.x以後不支持
                        font: {
                            size: 16, //temp add
                        },
                    }
                }
            }
        };
        //add ext config.options if any
        if (dto.options != null)
            config.options = _Json.copy(dto.options, config.options);
        //add percentage if need
        if (percent) {
            config.options.plugins.tooltip = {
                callbacks: {
                    label: function (ctx) {
                        //注意:不同版本的屬性不同, 以下為3.9.1版 !!
                        //get sum if need
                        var list = ctx.dataset.data;
                        if (ctx.chart._sum == null) {
                            var sum = 0;
                            list.map((a) => {
                                sum += a;
                            });
                            ctx.chart._sum = sum;
                        }
                        //save old label if need
                        if (ctx._oldLabel == null)
                            ctx._oldLabel = ctx.label + ' ' + ctx.formattedValue;
                        //get percentage and add tail
                        var percentValue = (list[ctx.dataIndex] * 100 / ctx.chart._sum).toFixed(2) + "%";
                        return ctx._oldLabel + ' (' + percentValue + ')';
                    }
                }
            };
        }
        return new Chart(canvasElm, config);
    }
    //線形圖
    static line(canvasElm, dto) {
        return _Chart._show('line', canvasElm, dto, false);
    }
    //水平條狀圖
    static hbar(canvasElm, dto) {
        dto.options = {
            indexAxis: 'y'
        };
        //debugger;
        return _Chart._show('hbar', canvasElm, dto, false);
    }
    //圓餅圖
    static pie(canvasElm, dto) {
        return _Chart._show('pie', canvasElm, dto, null, true);
    }
    //甜甜圈
    static doughnut(canvasElm, dto) {
        return _Chart._show('doughnut', canvasElm, dto, null, true);
    }
    //多個線形圖
    static groupLine(canvasElm, dto) {
        /*
        //set curve line
        dto.datasets.map(a => {
            a.tension = 0;
        });
        */
        return _Chart._show('line', canvasElm, dto);
    }
    //多個線形圖
    static groupBar(canvasElm, dto) {
        return _Chart._show('bar', canvasElm, dto);
    }
    /**
     * show one line chart, called Chart.js
     */
    static drawLine(canvasId, ids, values, color) {
        this._clear();
        this._nowChart = new Chart(document.getElementById(canvasId), {
            type: 'line',
            data: {
                labels: ids,
                datasets: [{
                        //label: "Africa",
                        data: values,
                        borderColor: color,
                        fill: false
                    }]
            },
            options: {
                //legend: { display: false },
                plugins: {
                    legend: { display: false },
                },
                /*
                title: {
                    display: true,
                    text: 'World population per region (in millions)'
                }
                */
            }
        });
    }
    /**
     * initial datatable(use jquery datatables)
     * param {object} canvasElm
     * param {string[]} labels
     * param {number[]} values
     * param {string[]} colors
     * param {json} config: custom config
     * return {Chart}
     */
    static initPie(canvasElm, labels, values, colors, config) {
        //default config
        var config0 = {
            type: 'pie',
            options: {
                /*
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    },
                },
                */
                legend: {
                    position: 'right',
                    //fullWidth: false,
                    labels: {
                        boxWidth: 10,
                        //padding: 5,
                    },
                },
            },
            data: {
                labels: labels, // 標題
                datasets: [{
                        //label: "# of Votes", // 標籤
                        data: values, // 資料
                        backgroundColor: colors,
                        borderWidth: 1 // 外框寬度
                    }]
            },
        };
        //加入外部傳入的自定義組態
        if (config)
            config0 = _Json.copy(config, config0);
        return new Chart(canvasElm, config0);
    }
}

export default class _Code {
    //add empty option
    static addEmptyOpt(rows = []) {
        //rows ??= [];
        rows.unshift({ Id: '', Str: _BR.PlsSelect }); //加在第一筆
        return rows;
    }
    /**
     * filter json array
     * @param addEmpty {bool} default true
     */
    static filterRows(rows = [], value, addEmpty = true) {
        //rows ??= [];
        let result = rows
            .filter(row => row.Ext === value)
            .map(row => ({ Id: row.Id, Str: row.Str }));
        return addEmpty
            ? _Code.addEmptyOpt(result)
            : result;
    }
}

import moment from "moment";
import _Fun from './_Fun';
import _Str from './_Str';
import _iDate from './_iDate';
import _iSelect from './_iSelect';
export default class _Date {
    /**
     * ?? 傳回起迄日期(json) for 日期欄位查詢
     * param {string} start 開始日期欄位id
     * param {string} end 結束日期欄位id
     * params {object} box box object
     * return {json} 包含start, end欄位
     */
    static getStartEnd(start, end, box) {
        //var start2 = box.find
    }
    /**
     * get today date string in UI format
     */
    static uiToday() {
        var mm = moment();
        return _Date.mmToUiDate(mm);
    }
    /**
     * get this week monday in UI format
     */
    static uiWeekMonday() {
        var mm = moment().day(1);
        return _Date.mmToUiDate(mm);
    }
    static uiWeekFriday() {
        var mm = moment().day(5);
        return _Date.mmToUiDate(mm);
    }
    /**
     * get this month first day
     */
    static uiMonthDay1() {
        var mm = moment().startOf('month');
        return _Date.mmToUiDate(mm);
    }
    /**
     * get this month last day
     */
    static uiMonthDayLast() {
        var mm = moment().endOf('month');
        return _Date.mmToUiDate(mm);
    }
    /**
     * get current year, ex: 2021
     */
    static nowYear() {
        return (new Date()).getFullYear();
    }
    static mmToUiDate(mm) {
        return mm.format(_BR.MmUiDateFmt);
    }
    static mmToUiDt(mm) {
        return mm.format(_BR.MmUiDtFmt);
    }
    static mmToUiDt2(mm) {
        return mm.format(_BR.MmUiDt2Fmt);
    }
    static dsToUiDate(ds) {
        return _Str.isEmpty(ds)
            ? ''
            : _Date.mmToUiDate(moment(ds, _Fun.MmDateFmt));
    }
    static dtsToUiDate(dts) {
        return _Str.isEmpty(dts)
            ? ''
            : _Date.mmToUiDate(moment(dts, _Fun.MmDtFmt));
    }
    static dtsToFormat(ds, format) {
        if (format !== undefined) {
            return (_Str.isEmpty(ds))
                ? ''
                : moment(ds, _Fun.MmDtFmt).format(format);
        }
        return _Str.isEmpty(ds)
            ? ''
            : _Date.mmToUiDate(moment(ds, _Fun.MmDateFmt));
    }
    static dtsToUiDt(dts) {
        return _Str.isEmpty(dts)
            ? ''
            : _Date.mmToUiDt(moment(dts, _Fun.MmDtFmt));
    }
    /**
     * js datetime string to ui datetime2 string(no second)
     * param dts {string} js datetime string
     * return {string} ui datetime2 string(no second)
     */
    static dtsToUiDt2(dts) {
        return _Str.isEmpty(dts)
            ? ''
            : _Date.mmToUiDt2(moment(dts, _Fun.MmDtFmt));
    }
    //get datetime value for compare
    static dtsToValue(dts) {
        return (_Str.isEmpty(dts))
            ? 0
            : moment(dts, _Fun.MmDtFmt).valueOf();
    }
    static dtsToMoment(dts) {
        return (_Str.isEmpty(dts))
            ? null
            : moment(dts, _Fun.MmDtFmt);
    }
    /**
     * ui date string to js date string
     * param ds {string} ui date string
     * return {string} js date string
     */
    static uiToMmDate(ds) {
        var date = _Str.isEmpty(ds)
            ? '' : moment(ds, _BR.MmUiDateFmt).format(_Fun.MmDateFmt);
        return date;
    }
    /**
     * timeStamp to ui datetime string
     * param ts {string} timeStamp value, unit is second, convert to mini second
     * return {string}
     */
    static tsToUiDt(ts) {
        return (ts == '')
            ? ''
            : moment(parseInt(ts) * 1000).format(_BR.MmUiDtFmt);
    }
    /**
     * get hour string from datetime string
     * param dts {string} datetime string
     * return {string}
     */
    static getHourStr(dts) {
    }
    //?? get datetime string
    //time為下拉欄位
    static getDt(fDate, fTime, box) {
        var date = _iDate.get(fDate, box);
        var time = _iSelect.get(fTime, box);
        if (date == '')
            return '';
        else
            return (time == '') ? date : date + ' ' + time;
    }
    /**
     * compare two js date/datetime string
     * param ds1 {string} start js date string
     * param ds2 {string} end js date string
     * return {bool}
     */
    static isBig(ds1, ds2) {
        return moment(ds1, _Fun.MmDtFmt).isAfter(moment(ds2, _Fun.MmDtFmt));
    }
    /**
     * get month difference by date string
     * param ds1 {string} start date string
     * param ds2 {string} end date string
     * return {int}
     */
    static getMonthDiff(ds1, ds2) {
        return (_Str.isEmpty(ds1) || _Str.isEmpty(ds2))
            ? 0
            : _Date.getMonthDiffByDate(moment(ds1, _Fun.MmDtFmt), moment(ds2, _Fun.MmDtFmt));
    }
    /**
     * get month difference by date
     * param dt1 {moment obj} start date
     * param dt2 {moment obj} end date
     * return {int}
     */
    static getMonthDiffByDate(dt1, dt2) {
        return (dt2.getFullYear() - dt1.getFullYear()) * 12
            + dt2.getMonth() - dt1.getMonth() + 1;
    }
    /**
     * js date string add year
     * jsDateAddYear -> dsAddYear
     * param ds {string} js date string
     * param year {int} year to add
     * return {string} new js date string
     */
    static dsAddYear(ds, year) {
        return moment(ds, _Fun.MmDtFmt).add(year, 'y').format(_Fun.MmDtFmt);
    }
}

//操作DOM元素
export default class _Dom {
    //傳回字串, 不會自動轉型
    static getData(elm, fid) {
        return elm.getAttribute("data-" + fid);
    }
    static setData(elm, fid, value) {
        elm.setAttribute("data-" + fid, value);
    }
}

import _Input from './_Input';
import _Form from './_Form';
import _Date from './_Date';
import _Var from './_Var';
import _Obj from './_Obj';
import _File from './_File';
import _Ajax from './_Ajax';
import EditOne from './EditOne';
/**
 * 做為 EditOne/EditMany 的延伸函數庫, 可以在這裡存取其 instance 變數!!
 * 許多函數在初始化執行, 所以無法放在CrudE.js
 * 主要called by CrudE.js, EditOne.js, EditMany.js, 但其它程式也可呼叫 !!
 * 內容為:
 * 1.靜態 constant
 * 2.初始化函數
 * 3.get/set old value
 * 4.判斷是否為新資料 & 處理
 */
export default class _Edit {
    //constant with underline
    static Rows = '_rows';
    static Childs = '_childs'; //注意: 同時用在json資料、EditOne/EditMany(表達下層物件)
    static Deletes = '_deletes';
    static DataFkeyFid = '_fkeyfid'; //data field for fkey fid, lowercase
    //server side fid for file input collection, must pre '_'
    //key-value of file serverFid vs row key
    static FileJson = '_fileJson';
    //data property name for keep old value
    static DataOld = '_old';
    //前後端欄位: isNew, new row flag
    //IsNew: '_IsNew',
    //edit form mode
    //ModeBase: 'Base',
    //ModeUR: 'UR',   //user role mode
    /**
     * get rows of json
     * @param {any} json
     * @returns
     */
    static jsonGetRows(json) {
        return (json == null || json[_Edit.Rows] == null)
            ? null
            : json[_Edit.Rows];
    }
    static jsonGetRows0(json) {
        const rows = _Edit.jsonGetRows(json);
        return (rows == null || rows.length == 0)
            ? null
            : rows[0];
    }
    //upJson get child json
    //_getChildJson -> getChildJson
    static getChildJson(upJson, childIdx) {
        const childs = _Edit.Childs;
        return (upJson == null || upJson[childs] == null || upJson[childs].length <= childIdx)
            ? null
            : upJson[childs][childIdx];
    }
    //upJson get child rows
    static getChildRows(upJson, childIdx) {
        const child = _Edit.getChildJson(upJson, childIdx);
        return _Edit.jsonGetRows(child);
    }
    static getChildRows0(upJson, childIdx) {
        const rows = _Edit.getChildRows(upJson, childIdx);
        return (rows == null || rows.length == 0)
            ? null : rows[0];
    }
    /**
     * upJson set child rows
     * @param upJson {json}
     * @param childIdx {int}
     * @param rows {jsons}
     * @returns {json} child object
     */
    static setChildRows(upJson, childIdx, rows) {
        const fid = _Edit.Childs;
        if (upJson == null)
            upJson = {};
        if (upJson[fid] == null)
            upJson[fid] = [];
        if (upJson[fid].length <= childIdx)
            upJson[fid][childIdx] = {};
        const child = upJson[fid][childIdx];
        child[_Edit.Rows] = rows;
        return child;
    }
    /**
     * setFidTypeVars + setFileVars -> initVars
     * 設定: fidTypes, fidTypeLen, fileFids, fileLen, hasFile
     * param edit {object} EditOne/EditMany object
     * param box {object} container
     * return void
     */
    static initVars(edit, box) {
        const fidTypes = [];
        const fidRadios = [];
        box.find(_Input.fidFilter()).each((i, item) => {
            const obj = $(item);
            const j = i * 2;
            const fid = _Input.getFid(obj);
            const ftype = _Input.getType(obj);
            fidTypes[j] = fid;
            fidTypes[j + 1] = ftype;
            if (ftype == 'radio')
                fidRadios[fidRadios.length] = fid;
        });
        edit.fidTypes = fidTypes;
        edit.fidTypeLen = edit.fidTypes.length;
        edit.fidRadios = [...new Set(fidRadios)]; //移除重複元素, ES6語法 !!
        edit.fileFids = []; //upload file fid array
        box.find('[data-type=file]').each((index, item) => {
            edit.fileFids[index] = _Input.getFid($(item));
        });
        edit.fileLen = edit.fileFids.length;
        edit.hasFile = edit.fileFids.length > 0; //has input file or not
    }
    static isEditOne(edit) {
        return (edit instanceof EditOne);
    }
    /**
     * get old value
     * param obj {object} input JQuery object
     * return {string}
     */
    static getOld(obj) {
        return obj.data(_Edit.DataOld);
    }
    /**
     * set old value
     * param obj {object} input JQuery object
     * param value {int/string}
     */
    static setOld(obj, value) {
        obj.data(_Edit.DataOld, value);
    }
    /**
     * check a new row or not, parseInt(ABC123) will get int, cannot use it!!
     * param row {json}
     * param key {string}
     * return {bool}
     */
    static isNewRow(row, kid) {
        return _Edit.isNewKey(row[kid]);
    }
    /**
     * check a new JQuery object or not
     * param box {object} JQuery object
     * param key {string}
     * return {bool}
     */
    static isNewBox(box, kid) {
        return _Edit.isNewKey(_Input.get(kid, box));
    }
    /**
     * check is new key or not, key為空值或是小於0都視為new key
     * param key {string}
     * return {bool}
     */
    static isNewKey(key) {
        if (key == null)
            return true;
        const num = Number(key);
        return (!isNaN(num) && num <= 0); //0也是new key
    }
    /**
     * load row into 單筆UI
     * called by EditOne, EditMany(mode=one)
     * @param edit {EditOne/EditMany}
     * @param box {JQuery}
     * @param row {json}
     */
    static loadRow(edit, box, row) {
        _Form.loadRow(box, row);
        //set old value for each field
        for (let i = 0; i < edit.fidTypeLen; i = i + 2) {
            const fid = edit.fidTypes[i];
            const obj = _Obj.get(fid, box);
            obj.data(_Edit.DataOld, row[fid]);
        }
    }
    /**
     * get one updated row for New/Updated
     * 只讀取有異動的欄位
     * @param edit {EditOne/EditMany}
     * @param box {object} form object
     * @returns json row
     */
    static getUpdRow(edit, box) {
        //case new return row
        const result = {};
        let fid, ftype, value, obj;
        const row = _Form.toRow(box); //內容只包含需要儲存的欄位, PKey如何為唯讀可能不會寫入!!
        //無條件加入PKey欄位, 才能判斷是否新增
        row[edit.kid] = _Input.get(edit.kid, box);
        //case of New row
        if (_Edit.isNewRow(row, edit.kid)) {
            for (let j = 0; j < edit.fidTypes.length; j = j + 2) {
                fid = edit.fidTypes[j];
                ftype = edit.fidTypes[j + 1];
                obj = _Input.getObj(fid, box, ftype);
                value = row[fid];
                if (_Var.notEmpty(value)) {
                    if ((ftype === 'date' || ftype === 'dt') &&
                        _Date.dtsToValue(value) === _Date.dtsToValue(undefined))
                        continue;
                    result[fid] = value;
                }
            }
            return result;
        }
        /*
        var key = _Input.get(edit.kid, box);
        if (_Str.isEmpty(key))
            return row;
        */
        //case update: 讀取有異動的欄位
        let diff = false;
        let old;
        for (let j = 0; j < edit.fidTypes.length; j = j + 2) {
            //skip read only type
            fid = edit.fidTypes[j];
            ftype = edit.fidTypes[j + 1];
            //if (ftype === 'link' || ftype === 'read')
            //    continue;
            //radio如果沒有選取會傳回null !!
            obj = _Input.getObj(fid, box, ftype);
            old = obj ? _Obj.getData(obj, _Edit.DataOld) : '';
            value = row[fid];
            //if fully compare, string will not equal numeric !!
            if (value != old) {
                //date/dt old value has more length
                if ((ftype === 'date' || ftype === 'dt') &&
                    _Date.dtsToValue(value) === _Date.dtsToValue(old))
                    continue;
                result[fid] = value;
                diff = true;
            }
        }
        if (!diff)
            return null;
        //無條件加入PKey, 後端才能判是否新增
        result[edit.kid] = _Input.get(edit.kid, box);
        return result;
    }
    /**
     * onclick viewFile
     * 雖然直接開啟(pdf,docx...)比較方便, 但是各瀏覽器行為不同, 最後只有圖檔直接開啟, 其他則下載
     * window.open(url, "_blank") 會出現小方塊, 故不採用
     * @param table {string} table name
     * @param fid {string}
     * @param elm {element} link element
     * @param key {string} row key
     */
    static async viewFileA(table, fid, elm, key) {
        /*
        if (this.isNewKey(key)) {
            _Tool.msg(_BR.NewFileNotView);
        } else {
        */
        const data = {
            table: table,
            fid: fid,
            key: key,
            ext: _File.getFileExt(elm.innerText),
        };
        await _Ajax.getFileA('ViewFile', data, elm);
        /*
        //var url = _Str.format('ViewFile?table={0}&fid={1}&key={2}&ext={3}', table, fid, key, ext);
        if (_File.isImageExt(ext))
            _Tool.showImage(elm.innerHTML, url);
        else
            window.location = url;
        */
    }
    /**
     * getServerFid -> getFileSid
     * get server side variables name for file field
     * @param levelStr {string}
     * @param fid {string} ui file id
     * @returns {string} format: Table_Fid
     */
    static getFileSid(levelStr, fid) {
        return 't' + levelStr + '_' + fid;
    }
}

export default class _Error {
    static log(msg) {
        console.log(msg);
    }
}

import _Str from './_Str';
export default class _File {
    /**
     * get file name by path
     */
    static getFileName(path) {
        const sep = path.indexOf('/') > 0 ? '/' : '\\';
        return _Str.getTail(path, sep);
    }
    /**
     * get file ext without '.' in lowerCase, ex: txt
     */
    static getFileExt(path) {
        return _Str.getTail(path, '.').toLowerCase();
    }
    static isImageExt(ext) {
        return ",jpg,jpeg,png,gif,tif,tiff,".indexOf("," + ext + ",") >= 0;
    }
    static isExcelExt(ext) {
        return ",xls,xlsx,".indexOf("," + ext + ",") >= 0;
    }
}

export default class _Flow {
    static showSignRows(tbody, rows) {
        tbody.empty();
        if (rows == null)
            return;
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            tbody.append(`
<tr>
    <td>${row.NodeName}</td>
    <td>${row.SignerName}</td>
    <td>${row.GetTime}</td>
    <td>${row.SignStatusName}</td>
    <td>${row.Note}</td>
</tr>`);
        }
    }
}

import _Input from './_Input';
import _iText from './_iText';
import _iTextarea from './_iTextarea';
import _iDate from './_iDate';
import _iSelect from './_iSelect';
import _iCheck from './_iCheck';
import _iRadio from './_iRadio';
import _Btn from './_Btn';
import _Obj from './_Obj';
export default class _Form {
    /**
     * get input values, 排除不儲存的欄位, 可用在多筆的單行
     * param form {object} input form
     * return {json}
     */
    static toRow(form) {
        //skip link & read fields
        const row = {};
        form.find(_Input.fidFilter()).filter(':not(.xi-unsave)').each(function () {
            const obj = $(this);
            row[_Input.getFid(obj)] = _Input.getO(obj, form);
        });
        return row;
    }
    static toRowStr(form) {
        return JSON.stringify(_Form.toRow(form));
    }
    /**
     * load json row into form UI (container object)
     * param form {object} form or box object
     * param json {json}
     */
    static loadRow(form, row) {
        for (const key in row) {
            if (Object.prototype.hasOwnProperty.call(row, key)) {
                _Input.set(key, row[key], form);
            }
        }
    }
    /**
     * reset all inputs with name attribute
     * param form {object}
     * param init {bool} 是否填入初始值, default false
     */
    static reset(form, init) {
        const items = form.find(_Input.fidFilter());
        if (init) {
            items.each(function () {
                const obj = $(this);
                _Input.setO(obj, obj.data('init'), form);
            });
        }
        else {
            items.each(function () {
                _Input.setO($(this), '', form);
            });
        }
    }
    /**
     * check has file input or not
     */
    static hasFile(form) {
        return form.find(':file').length > 0;
    }
    /**
     * set form inputs edit status
     * param form {object} jquery form/box
     * param status {bool} edit status
     */
    static setEdit(form, status) {
        //text & textArea
        _iText.setEditO(form.find('input:text'), status);
        _iTextarea.setEditO(form.find('textarea'), status);
        //date, dt
        _iDate.setEditO(form.find('.date input'), status);
        //dropdown
        _iSelect.setEditO(form.find('select'), status);
        //checkbox & radio
        _iCheck.setEditO(form.find(':checkbox'), status);
        _iRadio.setEditO(form.find(':radio'), status);
        //TODO: html
        //button
        _Btn.setEdit(form.find('button'), status);
    }
    /**
     * hide & show div with effect
     * param hides {array} object array to hide
     * param shows {array} object array to show
     */
    static hideShow(hides, shows) {
        //hide first
        if (hides) {
            for (let i = 0; i < hides.length; i++) {
                const form1 = hides[i];
                form1.fadeOut(500, function () {
                    _Obj.hide(form1);
                });
            }
        }
        //show
        if (shows) {
            for (let i = 0; i < shows.length; i++) {
                const form2 = shows[i];
                form2.fadeIn(500, function () {
                    _Obj.show(form2);
                });
            }
        }
    }
}

import moment from "moment";
import _Ajax from './_Ajax';
import _Leftmenu from './_Leftmenu';
import _Pjax from './_Pjax';
import _Tool from './_Tool';
import _Input from './_Input';
import _Obj from './_Obj';
/*
export interface DtColDef {
    className?: string;
    targets?: string;
    type?: string;
    orderable?: boolean;
    orderSequence?: string[];
    [key: string]: any;
}
*/
export default class _Fun {
    // #region constant (big camel) ===
    static MmDateFmt = 'YYYY/MM/DD';
    static MmDtFmt = 'YYYY/MM/DD HH:mm:ss';
    static FidErrorMsg = '_ErrorMsg';
    static PreBrError = 'B:';
    static CssFlag = 'x-flag';
    static HideRwd = 'x-hide-rwd';
    // #endregion
    // variables
    static userId = '';
    static locale = 'zh-TW';
    static maxFileSize = 50971520; //upload file limit(50M)
    static isRwd = false;
    static pageRows = 10; //must be 10,20(not 25),50,100
    static nowDom = ''; //now dom event element
    static lengthMenu = [10, 20, 50, 100];
    static jwtToken = ''; //for JWT, 登入後自行設定內容
    // mid variables
    static data = {};
    // datatables column define default values
    static dtColDef = {
        className: 'x-center',
        targets: '_all',
        type: 'string',
        orderable: false,
        orderSequence: ['asc', 'desc'],
    };
    /**
     * initial
     * param {string} locale
     * param {string} pjaxArea Filter
     */
    static init(locale) {
        //set jwt token
        _Fun.jwtToken = localStorage.getItem('_jwtToken') || '';
        localStorage.removeItem('_jwtToken');
        //initial
        _Fun.locale = locale;
        _Leftmenu.init();
        _Pjax.init('.x-main-right');
        _Tool.init();
        moment.locale(_Fun.locale);
        //註冊事件, 避免使用inline script for CSRF
        var body = $('body');
        _Fun.setEvent(body, 'click');
        _Fun.setEvent(body, 'change');
        //資安: 防止CSRF
        $.ajaxSetup({
            headers: {
                'RequestVerificationToken': $('meta[name="csrf-token"]').attr('content')
            }
        });
    }
    static async onHelloA() {
        await _Ajax.getStrA('../Fun/Hello', null, function (msg) {
            alert(msg);
        });
    }
    static getMe() {
        return $(_Fun.nowDom);
    }
    static getMeElm() {
        return _Fun.nowDom;
    }
    static getMeValue() {
        return _Input.getO($(_Fun.nowDom));
    }
    /**
     * 註冊事件, 避免使用inline script for CSRF
     * param {object} box 容器
     * param {string} eventName name(不含on)
     */
    static setEvent(box, eventName) {
        var event2 = 'on' + eventName;
        box.on(eventName, `[data-${event2}]`, function () {
            _Fun.nowDom = this;
            var me = $(this);
            const fnPath = me.data(event2);
            var argsStr = me.data("args");
            argsStr = (argsStr == null) ? "" : argsStr.toString();
            const args = argsStr ? argsStr.split(",") : [];
            const parts = fnPath.split(".");
            let obj = window;
            for (let i = 0; i < parts.length - 1; i++) {
                obj = obj[parts[i]];
            }
            const fnName = parts[parts.length - 1];
            const fn = obj[fnName];
            if (typeof fn === "function") {
                fn.apply(obj, args);
            }
            else {
                console.warn(`Function ${fnPath} not found`);
            }
        });
    }
    /**
     * get default value if need
     * param val {object} checked value
     * param defVal {object} default value to return if need
     */
    static default(val, defVal) {
        return (val == null) ? defVal : val;
    }
    static hasValue(obj) {
        return !(obj == null);
    }
    static async onSetLocaleA(code) {
        await _Ajax.getStrA('../Fun/SetLocale', { code: code }, function (msg) {
            location.reload();
        });
    }
    static block(obj) {
        _Obj.show(_Tool.xWork);
    }
    static unBlock(obj) {
        _Obj.hide(_Tool.xWork);
    }
}

import _Fun from './_Fun';
export default class _Group {
    static toggle() {
        // $(this).next().toggle(); // 簡單切換 show/hide
        _Fun.getMe().parent('.x-group').next().slideToggle(); // 如果想要動畫，用這行
    }
}

import _Str from './_Str';
export default class _Helper {
    /**
     * ??
     */
    static getBaseProp(rowNo, fid, value, type, required, editable, extAttr) {
        let attr = _Str.format("type='{0}' data-id='{1}' name='{2}' value='{3}'", type, fid, fid + rowNo, value);
        if (required === true) {
            attr += " required";
        }
        if (editable === false) {
            attr += " readonly";
        }
        if (_Str.notEmpty(extAttr)) {
            attr += " " + extAttr;
        }
        return _Str.trim(attr);
    }
    //參考 _Helper.cs GetEventAttr
    static getEventAttr(fnName, fnValue, args) {
        if (_Str.isEmpty(fnValue)) {
            return "";
        }
        let attr = `data-${fnName}='${fnValue}'`;
        if (_Str.notEmpty(args)) {
            attr += ` data-args='${args}'`;
        }
        return attr;
    }
}

import _iSelect from './_iSelect';
import _Fun from './_Fun';
export default class _Html {
    //load css theme
    static loadTheme(color) {
        const link = document.getElementById('xgTheme');
        if (link) {
            link.href = `/css/view/_xg${color}.css`;
        }
    }
    static loadThemeByElm() {
        const color = _iSelect.getO(_Fun.getMe());
        _Html.loadTheme(color);
    }
    //*** 必要屬性 or 函式 ***
    //get locale code
    static encodeRow(row, fields) {
        for (let i = 0; i < fields.length; i++) {
            const id = fields[i];
            if (id in row) {
                row[id] = _Html.encode(row[id]);
            }
        }
        return row;
    }
    //see: https://stackoverflow.com/questions/14346414/how-do-you-do-html-encode-using-javascript
    static encode(value) {
        return $('<div/>').text(value).html() ?? '';
    }
    static decode(value) {
        return $('<div/>').html(value).text() ?? '';
    }
    //?? 更新html欄位內容, 讀取 text()
    static update(id, box) {
        const filter = '#' + id;
        const obj = (box === undefined) ? $(filter) : box.find(filter);
        //obj.text(value);
        //obj.summernote('code', $(filter).text());
        //debugger;
        obj.summernote('code', obj.text());
    }
    //??
    static updates(ids, box) {
        for (let i = 0; i < ids.length; i++) {
            _Html.update(ids[i], box);
        }
    }
}

import _Obj from './_Obj';
export default class _iBase {
    /**
     * get value by fid, get -> getF -> getO
     * param fid {string}
     * param box {object}
     * return {string}
     */
    static get(fid, box) {
        return this.getO(_Obj.get(fid, box));
    }
    //get value by id
    static getD(id, box) {
        return this.getO(_Obj.getById(id, box));
    }
    //get value by filter
    static getF(ft, box) {
        return this.getO(_Obj.getByFt(ft, box));
    }
    //get value by object
    static getO(obj) {
        return obj == null ? null : obj.val();
    }
    //set value, set -> setF -> setO
    static set(fid, value, box) {
        this.setO(_Obj.get(fid, box), value);
    }
    static setD(id, value, box) {
        this.setO(_Obj.getById(id, box), value);
    }
    static setF(ft, value, box) {
        this.setO(_Obj.getByFt(ft, box), value);
    }
    static setO(obj, value) {
        obj.val(value);
    }
    //get input border for show red border
    //default return this, drive class could rewrite.
    static getBorder(obj) {
        return obj;
    }
    //set edit status
    static setEdit(fid, status, box) {
        this.setEditO(_Obj.get(fid, box), status);
    }
    static setEditO(obj, status) {
        obj.prop('readonly', !status);
    }
}

import _iBase from './_iBase';
import _Obj from './_Obj';
export default class _iCheck extends _iBase {
    /**
     * Check0Id -> FidCheck0
     * default data-fid attribute value for multiple selection
     */
    static fidCheck0 = '_check0';
    /**
     * filter for get checked list objects, 初始代階段不可使用 _Input
     */
    static fltCheckeds = "[data-fid='_check0']:checked";
    /**
     * (override)get data-value, not checked status !!, return '0' if unchecked.
     */
    static getO(obj) {
        return obj.is(':checked') ? obj.data('value') : '0';
    }
    /**
     * (override)set checked or not
     */
    static setO(obj, value) {
        const status = !(value == null || value === '0' || value === 'False' || value === false);
        obj.prop('checked', status);
    }
    /**
     * (override) set status by object(s)
     */
    static setEditO(obj, status) {
        obj.prop('disabled', !status);
    }
    /**
     * checked -> isChecked
     * get checked status by fid
     * return {bool}
     */
    static isChecked(fid, form) {
        return _iCheck.isCheckedO(_Obj.get(fid, form));
    }
    /**
     * checkedO -> isCheckedO
     * get checked status by object
     * return {bool}
     */
    static isCheckedO(obj) {
        return obj.is(':checked');
    }
    /**
     * getCheckeds -> getCheck0Values
     * get checked checkebox data-value string array
     * form {object} container
     * fid {string} (optional '_check0') data-fid value
     * return {string array} checked value list
     */
    static getCheck0Values(form) {
        const ary = [];
        const item = _Obj.getByFt(_iCheck.fltCheckeds, form);
        if (_Obj.notEmpty(item)) {
            item.each(function (i) {
                ary[i] = $(this).data('value');
            });
        }
        return ary;
    }
    /**
     * (不是處理_check0)讀取多個一群checkbox的值(有勾選的欄位only)
     * form {object} container
     * preFid {string} fid前面字元
     * return {string array} checked value list
     */
    static getCheckedValues(form, preFid) {
        const ary = [];
        const item = _Obj.getByFt(`[data-fid^='${preFid}']:checked`, form);
        if (_Obj.notEmpty(item)) {
            item.each(function (i) {
                ary[i] = $(this).data('value');
            });
        }
        return ary;
    }
    /**
     * no used??
     * get checked checkebox data-value string array
     * form {object} container
     * fid {string} (optional '_check0') data-fid value
     * return {string array}
     */
    static checkAll(form, status) {
        _iCheck.setO(form.find(_iCheck.fltCheckeds), status);
    }
}
Object.assign(_iCheck, _iBase);

import _Obj from './_Obj';
//不繼承 iBase
//bootstrap-colorpicker 支援到 bootstrap4, 若要用此功能可改用其他元件
export default class _iColor {
    /*
    static init(): void {
        $('.x-color').colorpicker({
            //component: true,
            //onchange: function (me, color) {
            //    $(me).css('background-color', color.toHex());
            //},
        });
    }
    */
    static get(fid, form) {
        return _iColor.getO(_Obj.get(fid, form));
    }
    //value by filter
    static getF(filter, form) {
        return _iColor.getO(_Obj.getByFt(filter, form));
    }
    //value by object
    static getO(obj) {
        return _iColor.rgbToHex(obj.find('i').css('background-color') || '');
    }
    //convert jquery RGB color to hex(has #)
    //https://stackoverflow.com/questions/5999209/how-to-get-the-background-color-code-of-an-element
    static rgbToHex(rgb) {
        const parts = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (!parts) {
            return '';
        }
        const hexParts = [];
        for (let i = 1; i <= 3; ++i) {
            let part = parseInt(parts[i], 10).toString(16);
            if (part.length === 1) {
                part = '0' + part;
            }
            hexParts.push(part);
        }
        return '#' + hexParts.join('');
    }
}

import 'bootstrap-datepicker';
import _iBase from './_iBase';
import _Obj from './_Obj';
import _Fun from './_Fun';
import _Str from './_Str';
import _Date from './_Date';
export default class _iDate extends _iBase {
    static BoxFilter = '.date';
    /**
     * get ymd with format _Fun.MmDateFmt
     * param obj {object} date input object
     * return mm date
     */
    static getO(obj) {
        return _Date.uiToMmDate(obj.val());
    }
    /**
     * set input value
     * param obj {object} date input object
     * param value {string} format: _Fun.MmDateFmt
     */
    static setO(obj, value) {
        _iDate._boxSetDate(_iDate._objToBox(obj), value);
    }
    /**
     * set edit status
     * param obj {object} date input object
     */
    static setEditO(obj, status) {
        obj.prop('disabled', !status);
    }
    /**
     * initial, called by _me.crudE.js
     * 注意:
     * 欄位必須放在 form裡面, 因為使用 validator !!
     * param box {object}
     * param fid {string} optional
     */
    static init(box, fid) {
        const obj = _Str.isEmpty(fid)
            ? box.find(_iDate.BoxFilter)
            : _Obj.get(fid, box).closest(_iDate.BoxFilter);
        if (obj.length === 0)
            return;
        //initial
        obj.datepicker({
            language: _Fun.locale,
            autoclose: true,
            showOnFocus: false,
            todayHighlight: true,
        }).on('changeDate', function (e) {
            _iDate._boxGetInput($(this)).valid();
        });
        //stop event, or it will popup when reset(jquery 3.21) !!
        obj.find('.input-group-addon').off('click');
    }
    //show/hide datepicker
    static onToggle() {
        const btn = _Fun.getMeElm();
        _iDate._elmToBox(btn).datepicker('show');
    }
    //reset value
    static onReset() {
        const btn = _Fun.getMeElm();
        const box = _iDate._elmToBox(btn);
        const input = _iDate._boxGetInput(box);
        if (_iDate.getEditO(input)) {
            _iDate._boxSetDate(box, '');
        }
    }
    //get edit status, return bool
    static getEditO(obj) {
        return !obj.is(':disabled');
    }
    /**
     * input element to date box
     * return {object}
     */
    static _elmToBox(elm) {
        return _iDate._objToBox($(elm));
    }
    static _objToBox(obj) {
        return obj.closest(_iDate.BoxFilter);
    }
    static _boxSetDate(box, date) {
        date = _Date.dsToUiDate(date);
        box.datepicker('update', date);
        box.trigger({
            type: 'changeDate',
            date: date
        });
    }
    static _boxGetInput(box) {
        return box.find('input');
    }
}

import _iBase from './_iDate';
import _iDate from './_iDate';
import _iSelect from './_iSelect';
import _Str from './_Str';
export default class _iDt extends _iBase {
    //constant
    //BoxFilter: '.date',
    //=== get/set start ===
    static getO(obj) {
        //var date = _Date.uiToMmDate(_iDate.getO(_iDt._boxGetDate(obj)));
        const date = _iDate.getO(_iDt._boxGetDate(obj));
        return _Str.isEmpty(date)
            ? ''
            : date + ' ' +
                _iSelect.getO(_iDt._boxGetHour(obj)) + ':' +
                _iSelect.getO(_iDt._boxGetMin(obj));
    }
    /**
     * set input value
     * param obj {object} datetime box object
     * param value {string} _Fun.MmDtFmt
     */
    static setO(obj, value) {
        let date;
        let hour;
        let min;
        if (_Str.isEmpty(value)) {
            date = '';
            hour = 0;
            min = 0;
        }
        else {
            date = value; //_iDate will set
            hour = parseInt(_Str.getMid(value, ' ', ':'), 10);
            min = parseInt(_Str.getMid(value, ':', ':'), 10);
        }
        _iDate.setO(_iDt._boxGetDate(obj), date);
        _iSelect.setO(_iDt._boxGetHour(obj), hour);
        _iSelect.setO(_iDt._boxGetMin(obj), min);
    }
    static setEditO(obj, status) {
        _iDate.setEditO(_iDt._boxGetDate(obj), status);
        _iSelect.setEditO(_iDt._boxGetHour(obj), status);
        _iSelect.setEditO(_iDt._boxGetMin(obj), status);
    }
    //=== private function below ===
    /**
     * get date input object(not date box)
     * param box {object} datetime box
     * return {object}
     */
    static _boxGetDate(box) {
        return box.find('input:first');
    }
    /**
     * get hour object
     * param box {object} datetime box
     * return {object}
     */
    static _boxGetHour(box) {
        return box.find('select:first');
    }
    /**
     * get minute object
     * param box {object} datetime box
     * return {object}
     */
    static _boxGetMin(box) {
        return box.find('select:last');
    }
}

import _iBase from './_iBase';
import _Obj from './_Obj';
import _Fun from './_Fun';
import _Str from './_Str';
import _File from './_File';
import _Tool from './_Tool';
export default class _iFile extends _iBase {
    //=== overwrite start ===
    /**
     * get border object
     * param obj {object} input object
     */
    static getBorder(obj) {
        return obj.prev();
    }
    static setO(obj, value) {
        obj.val(value); //set hidden input value
        _iFile._elmToLink(obj).text(value); //set link show text
    }
    //=== overwrite end ===
    /**
     * formData add file for upload, called by EditOne/EditMany.js
     * param data {formData}
     * param fid {string} file field id
     * param serverFid {string} server side variable name
     * param box {object} form/row object
     * return {boolean} has file or not
     */
    static dataAddFile(data, fid, serverFid, box) {
        const obj = _Obj.get(fid, box);
        const file = _iFile.getUploadFile(_iFile._elmToFile(obj));
        const hasFile = (file != null);
        if (hasFile) {
            data.append(serverFid, file);
        }
        return hasFile;
    }
    //=== event start ===
    static onOpenFile() {
        const btn = _Fun.getMe();
        const file = _iFile._elmToFile(btn);
        file.focus().trigger('click'); //focus first !!
    }
    //file: input element
    static onChangeFile() {
        //case of empty file
        const fileElm = _Fun.getMeElm();
        const obj = _iFile._elmToObj(fileElm);
        const fileObj = $(fileElm);
        const value = fileElm.value; //full path
        if (_Str.isEmpty(value)) {
            _iFile.setO(obj, '');
            return;
        }
        //check file ext
        let exts = (fileObj.data('exts') || '').toLowerCase();
        if (_Str.notEmpty(exts) && exts !== '*') {
            const ext = _File.getFileExt(value);
            exts = ',' + exts + ',';
            if (exts.indexOf(',' + ext + ',') < 0) {
                _Tool.msg(_BR.UploadFileNotMatch);
                fileElm.value = '';
                return;
            }
        }
        //check file size
        const max = fileObj.data('max');
        if (fileElm.files && fileElm.files[0] && fileElm.files[0].size > max * 1024 * 1024) {
            _Tool.msg(_Str.format(_BR.UploadFileNotBig, max));
            fileElm.value = '';
            return;
        }
        //case ok
        _iFile.setO(obj, _File.getFileName(value));
    }
    static onDeleteFile() {
        const btn = _Fun.getMe();
        _iFile.setO(_iFile._elmToObj(btn), '');
    }
    //=== event end ===
    //?? initial after load rows
    static zz_init(fid, path, form) {
        const fileObj = _Obj.get(fid, form);
        fileObj.val('');
        //_iFile.setFun(fileObj, ''); //set fun to empty
        //_iFile.setPathByFile(fileObj, path);
        /*
        //file element 要 reset
        var file = _Obj.getByFt(_iFile.fileF(id), form);
        //var $el = $('#example-file');
        file.wrap('<form>').closest('form').get(0).reset();
        file.unwrap();
        */
    }
    //=== private function below ===
    /**
     * element to file box object
     * param elm {element}
     * return {object} file box object
     */
    static _elmToBox(elm) {
        return $(elm).closest('.xi-box');
    }
    //get file object
    static _elmToFile(elm) {
        return _iFile._boxGetFile(_iFile._elmToBox(elm));
    }
    //get input object
    static _elmToObj(elm) {
        return _iFile._boxGetObj(_iFile._elmToBox(elm));
    }
    //get link object
    static _elmToLink(elm) {
        return _iFile._boxGetLink(_iFile._elmToBox(elm));
    }
    /**
     * box get link object
     * param box {object} box object
     */
    static _boxGetLink(box) {
        //return box.find('a');
        return box.find('a').last();
    }
    static _boxGetFile(box) {
        return box.find(':file');
    }
    //box get input object
    static _boxGetObj(box) {
        return box.find('[data-type=file]');
    }
    //border get uploaded file, return null if empty
    static getUploadFile(fileObj) {
        if (fileObj.length === 0) {
            return null;
        }
        const inputElm = fileObj.get(0);
        const files = inputElm.files;
        return (files && files.length > 0) ? files[0] : null;
    }
}
Object.assign(_iFile, _iBase);

import _iBase from './_iBase';
export default class _iHtml extends _iBase {
    //constant
    static Filter = '[data-type=html]';
    static getO(obj) {
        //return obj.html();
        //return obj.val();
        return obj.summernote('code');
    }
    static setO(obj, value) {
        //value = $('<div/>').html(value).text(); //decode
        obj.summernote('code', value);
        //obj.html(value);
        //obj.val(value);
    }
    //set edit status
    static setEditO(obj, status) {
        obj.summernote(status ? 'enable' : 'disable');
    }
    /**
     * init html editor
     * param edit {object} EditOne/EditMany object
     * param prog {string} program code
     * param height {int} (optional)input height(px)
     */
    static init(edit, prog, height) {
        edit.eform.find(_iHtml.Filter).each(function () {
            const upMe = $(this);
            upMe.data('prog', prog); //for onImageUpload()
            //init summernote
            upMe.summernote({
                height: height || 200,
                //new version use callbacks !!
                callbacks: {
                    /*
                    */
                    //https://codepen.io/ondrejsvestka/pen/PROgzQ
                    onChange: function (contents, $editable) {
                        //sync value
                        const me = $(this);
                        if (me.summernote('isEmpty')) {
                            me.val('');
                            //empty html value, carefully cause endless loop !!
                            let me2 = me;
                            if (me2.summernote('code') !== '') {
                                me2.summernote('code', '');
                            }
                        }
                        else {
                            me.val(contents);
                        }
                        //me.val(me.summernote('isEmpty') ? '' : contents);
                        //re-validate
                        edit.validator.element(me);
                        /*
                        var me = $(this);
                        me.val(me.summernote('isEmpty') ? "" : contents);
                        edit.validator.element(me);
                        */
                    },
                    onImageUpload: function (files) {
                        const me = $(this); //jquery object
                        const data = new FormData();
                        data.append('file', files[0]);
                        //data.append('prog', me.data('prog'));
                        $.ajax({
                            data: data,
                            type: "POST",
                            url: "SetHtmlImage", //backend fixed action !!
                            cache: false,
                            contentType: false,
                            processData: false,
                            success: function (url) {
                                //create image element & add into editor
                                const image = document.createElement('img');
                                image.src = url;
                                me.summernote('insertNode', image); //new version syntax !!
                            }
                        });
                    },
                },
                //=== add image ext attr start ===
                /*
                lang: _Fun.locale,
                popover: {
                    image: [
                        ['custom', ['imageAttributes']],
                        ['imagesize', ['imageSize100', 'imageSize50', 'imageSize25']],
                        ['float', ['floatLeft', 'floatRight', 'floatNone']],
                        ['remove', ['removeMedia']]
                    ],
                },
                imageAttributes: {
                    imageDialogLayout: 'default', // default|horizontal
                    icon: '<i class="note-icon-pencil"/>',
                    removeEmpty: false // true = remove attributes | false = leave empty if present
                },
                displayFields: {
                    imageBasic: true,  // show/hide Title, Source, Alt fields
                    imageExtra: false, // show/hide Alt, Class, Style, Role fields
                    linkBasic: false,   // show/hide URL and Target fields for link
                    linkExtra: false   // show/hide Class, Rel, Role fields for link
                },
                */
                //=== add image ext attr start ===
            }); //summernote()
        }); //each()
    }
    //set edit status for all html input
    static setEdits(box, subFilter, status) {
        const item = box.find(_iHtml.Filter + subFilter);
        if (item.length > 0) {
            item.summernote(status ? 'enable' : 'disable');
        }
    }
}
Object.assign(_iHtml, _iBase);

import _Obj from './_Obj';
//不繼承 _iBase
export default class _iLink {
    //value by fid
    static get(fid, form) {
        return this.getO(_Obj.get(fid, form));
    }
    //value by object
    static getO(obj) {
        return obj.text();
    }
    static set(fid, value, form) {
        this.setO(_Obj.get(fid, form), value);
    }
    static setO(obj, value) {
        obj.text(value);
    }
}

import InputTypeEstr from '../Enums/InputTypeEstr';
import _Obj from './_Obj';
import _Var from './_Var';
import _Str from './_Str';
import _Date from './_Date';
import _iText from './_iText';
import _iTextarea from './_iTextarea';
import _iCheck from './_iCheck';
import _iRadio from './_iRadio';
import _iSelect from './_iSelect';
import _iDate from './_iDate';
import _iDt from './_iDt';
import _iFile from './_iFile';
import _iHtml from './_iHtml';
import _iRead from './_iRead';
import _iLink from './_iLink';
export default class _Input {
    static isRadio(ftype) {
        return (ftype === InputTypeEstr.Radio);
    }
    //get input value
    static get(fid, box) {
        return _Input.getO(_Obj.get(fid, box), box);
    }
    /**
     * get input value by object
     * param obj {object}
     * param type {string} (optional) data-type
     * return input value
     */
    static getO(obj, box, type) {
        type = type || _Input.getType(obj);
        switch (type) {
            case InputTypeEstr.Text:
                return _iText.getO(obj);
            case InputTypeEstr.Textarea:
                return _iTextarea.getO(obj);
            case InputTypeEstr.Check:
                return _iCheck.getO(obj);
            case InputTypeEstr.Radio:
                return _iRadio.getO(obj, box);
            case InputTypeEstr.Select:
                return _iSelect.getO(obj);
            case InputTypeEstr.Date:
                return _iDate.getO(obj);
            case InputTypeEstr.DateTime:
                return _iDt.getO(obj);
            case InputTypeEstr.File:
                return _iFile.getO(obj);
            case InputTypeEstr.Html:
                return _iHtml.getO(obj);
            case InputTypeEstr.Read:
                return _iRead.getO(obj);
            case InputTypeEstr.Link:
                return _iLink.getO(obj);
            default:
                //text, textarea
                return obj?.val?.();
        }
    }
    static set(fid, value, box) {
        _Input.setO(_Obj.get(fid, box), value, box);
    }
    /**
     * set input value by object
     * param obj {object}
     * param value {object}
     * param box {object} for radio
     * param type {string} optional, data-type
     */
    static setO(obj, value, box, type) {
        if (obj == null || !_Var.isPureData(value))
            return;
        type = type || _Input.getType(obj);
        switch (type) {
            case InputTypeEstr.Text:
                _iText.setO(obj, value);
                break;
            case InputTypeEstr.Check:
                _iCheck.setO(obj, value);
                break;
            case InputTypeEstr.Radio:
                //此時 obj 為 array
                value = value || '0';
                _iRadio.setO(obj, value, box);
                break;
            case InputTypeEstr.Select:
                _iSelect.setO(obj, value);
                break;
            case InputTypeEstr.Date:
                return _iDate.setO(obj, value);
            case InputTypeEstr.DateTime:
                return _iDt.setO(obj, value);
            case InputTypeEstr.File:
                _iFile.setO(obj, value);
                break;
            case InputTypeEstr.Textarea:
                _iTextarea.setO(obj, value);
                break;
            case InputTypeEstr.Html:
                _iHtml.setO(obj, value);
                break;
            case InputTypeEstr.Read:
                const format = obj?.data?.('format');
                if (_Str.notEmpty(format) && _Str.notEmpty(_BR[format]))
                    value = _Date.dtsToFormat(value, _BR[format]);
                _iRead.setO(obj, value);
                break;
            case InputTypeEstr.Link:
                return _iLink.setO(obj, value);
            default:
                //text
                obj?.val?.(value);
                break;
        }
    }
    /**
     * get input field type
     * 如果obj沒有data-type, 可能存在child
     */
    static getType(obj) {
        return obj?.attr?.('data-type') ?? obj?.find?.('[data-type]')?.attr?.('data-type');
    }
    /**
     * get object
     * param fid {string}
     * param box {object}
     * param ftype {string} optional
     * return object
     */
    static getObj(fid, box, ftype) {
        ftype = ftype || _Input.getType(_Obj.get(fid, box));
        return _Input.isRadio(ftype ?? '')
            ? _iRadio.getObj(fid, box) : _Obj.get(fid, box);
    }
    /**
     * get data-fid of object
     * param obj {object}
     * return fid string
     */
    static getFid(obj) {
        return obj?.data?.('fid');
    }
    /**
     * get data-fid string, ex: [data-fid=XXX]
     * param fid {string} optional, if empty means find all inputs with data-fid
     * return {string} filter
     */
    static fidFilter(fid) {
        return _Str.isEmpty(fid)
            ? '[data-fid]'
            : `[data-fid='${fid}']`;
    }
    static preFidFilter(fid) {
        return `[data-fid^='${fid}']`;
    }
}
// 為了內部自我參照
//const _Input = _Input;

import _iBase from './_iBase';
export default class _iNum extends _iBase {
}
Object.assign(_iNum, _iBase);

import _iBase from './_iBase';
import _Obj from './_Obj';
import _iCheck from './_iCheck';
import _Str from './_Str';
export default class _iRadio extends _iBase {
    //=== get ===
    //get checked data-value
    static get(fid, box) {
        return this._getByName(fid, box);
    }
    /**
     * get checked data-value by fid
     * param obj {object} single object
     */
    static getO(obj, box) {
        return this._getByName(_Obj.getName(obj), box);
    }
    //get checked object, 如果沒有選取則會回傳null !!
    static getObj(fid, box) {
        return _Obj.getByFt(`[name='${fid}']:checked`, box);
    }
    //get data-value by checked name
    static _getByName(name, box) {
        const obj = this.getObj(name, box);
        return _Obj.isEmpty(obj) ? '' : obj.data('value');
    }
    //=== set ===
    //改成用name來查欄位
    static set(fid, value, box) {
        this._setByName(fid, value, box);
    }
    static setO(obj, value, box) {
        this._setByName(_Obj.getName(obj), value, box);
    }
    static reset(fid, box) {
        const objs = _Obj.getByFt(`[name='${fid}']`, box);
        if (objs != null)
            objs.prop('checked', false);
    }
    //set checked status by name & data-value
    static _setByName(name, value, box) {
        const obj = _Obj.getByFt(`[name='${name}'][data-value='${value}']`, box);
        if (obj != null)
            obj.prop('checked', true);
    }
    //set status by name
    //改成用name來查欄位
    static setEdit(fid, status, box) {
        //use getN() !!
        this.setEditO(_Obj.get(fid, box), status);
    }
    /**
     * setEditOs -> setEditO, 因為上層呼叫 setEditO !!
     * @param {object} obj, 可以是複數
     * @param {bool} status
     */
    static setEditO(obj, status) {
        obj.attr('disabled', !status ? 'disabled' : null); //use attr !!
    }
    //for modal單選畫面
    //傳回checked一筆資料, 讀取tr全部data欄位
    static getCheck0Tr(form) {
        const radio = _Obj.getByFt(_iCheck.fltCheckeds, form).first();
        return (radio.length == 1) ? radio.closest('tr') : null;
    }
    /** * ?? for 多筆資料only(data-id)
     * 產生 checkbox html 內容, 與後端 XiCheckHelper 一致
     * @param {string} fid (optional)id/data-id
     * @param {string} label (optional)show label
     * @param {bool} checked default false, 是否勾選
     * @param {string} value (optional) 如果null則為1
     * @param {bool} editable default true, 是否可編輯
     * @param {string} extClass (optional) extClass
     * @param {string} extProp (optional) extProp
     * @return {string} html string.
    */
    static render(fid, label, checked, value, editable, extClass, extProp) {
        const html = "" +
            "<label class='xi-check {0}'>" +
            "   <input type='radio'{1}>{2}" +
            "   <span class='xi-rspan'></span>" +
            "</label>";
        //adjust
        label = label || '';
        extClass = extClass || '';
        extProp = extProp || '';
        let valStr = value || '';
        if (label == '')
            label = '&nbsp;';
        if (_Str.isEmpty(valStr))
            valStr = 1;
        //attr
        extProp += " data-id='" + fid + "' name='" + fid + "'" +
            " value='" + valStr + "'";
        if (checked)
            extProp += ' checked';
        if (editable !== undefined && !editable)
            extProp += ' disabled'; //disabled='disabled'
        return _Str.format(html, extClass, extProp, label);
    }
}
Object.assign(_iRadio, _iBase);

import _Obj from './_Obj';
//不繼承 _iBase
export default class _iRead {
    //value by fid
    static get(fid, form) {
        return this.getO(_Obj.get(fid, form));
    }
    //value by filter
    static getF(filter, form) {
        return this.getO(_Obj.getByFt(filter, form));
    }
    //value by object
    static getO(obj) {
        return obj.text();
    }
    static set(fid, value, form) {
        this.setO(_Obj.get(fid, form), value);
    }
    static setF(filter, value, form) {
        this.setO(_Obj.getByFt(filter, form), value);
    }
    static setO(obj, value) {
        obj.text(value);
        obj.text(value); //for XiRead
    }
}

import _iBase from './_iBase';
import _Obj from './_Obj';
import _Str from './_Str';
import _Ajax from './_Ajax';
export default class _iSelect extends _iBase {
    static get(fid, box) {
        return _iBase.get ? _iBase.get(fid, box) : '';
    }
    static set(fid, value, box) {
        return _iBase.set ? _iBase.set(fid, value, box) : null;
    }
    //#region override
    static getO(obj) {
        return (obj.length === 0) ? '' : obj.find('option:selected').val();
    }
    static setO(obj, value) {
        const filter = 'option[value="' + value + '"]';
        const item = obj.find(filter);
        if (item.length > 0) {
            item.prop('selected', true);
            return item;
        }
        else {
            //remove selected
            obj.find('option:selected').prop('selected', false);
            return null;
        }
    }
    static setEditO(obj, status) {
        obj.prop('disabled', !status);
    }
    //#endregion
    //get selected index(base 0)
    static getIndex(fid, box) {
        return this.getIndexO(_Obj.get(fid, box));
    }
    static getIndexO(obj) {
        return obj.prop('selectedIndex');
    }
    //get options count
    static getCount(fid, box) {
        return this.getCountO(_Obj.get(fid, box));
    }
    static getCountO(obj) {
        return obj.find('option').length;
    }
    //set by index(base 0)
    static setIndex(fid, idx, box) {
        this.setIndexO(_Obj.get(fid, box), idx);
    }
    static setIndexO(obj, idx) {
        obj.find('option').eq(idx).prop('selected', true);
    }
    //傳回選取的欄位的文字
    static getText(fid, box) {
        const obj = _Obj.get(fid, box);
        return this.getTextO(obj);
    }
    static getTextO(obj) {
        return obj.find('option:selected').text();
    }
    //傳回data屬性(name)值
    static getData(fid, name, box) {
        return _Obj.get(fid, box).find('option:selected').data(name);
    }
    static getDataO(obj, name) {
        return obj.find('option:selected').data(name);
    }
    //重新設定option內容
    //items: 來源array, 欄位為:Id,Str
    static setItems(fid, items, box) {
        const obj = _Obj.get(fid, box);
        this.setItemsO(obj, items);
    }
    //by object
    static setItemsO(obj, items) {
        obj.find('option').remove();
        if (items === null)
            return;
        for (let i = 0; i < items.length; i++) {
            obj.append($('<option></option>').attr('value', items[i].Id).text(items[i].Str));
        }
    }
    //get all options
    //getIdStrExts -> getExts
    static getExts(fid, box) {
        const rows = [];
        _Obj.get(fid, box).find('option').each(function (i) {
            const me = $(this);
            rows[i] = {
                Id: me.val(),
                Str: me.text(),
                Ext: me.data('ext'),
            };
        });
        return rows;
    }
    //重新設定option內容, 欄位為:Id,Str,Ext
    //setItems2 -> setExts
    static setExts(fid, items, box) {
        const filter = '#' + fid;
        const obj = box ? box.find(filter) : $(filter);
        obj.find('option').remove();
        if (items == null)
            return;
        for (let i = 0; i < items.length; i++) {
            obj.append(_Str.format("<option data-ext='{0}' value='{1}'>{2}</option>", items[i].Ext, items[i].Id, items[i].Str));
        }
    }
    //把多欄位值寫入json
    //fids: 欄位名稱 array
    static valuesToJson(json, fids, box) {
        for (let i = 0; i < fids.length; i++) {
            json[fids[i]] = this.get(fids[i], box);
        }
        return json;
    }
    //ie 不支援 option display:none !!
    //filter options by data-ext value
    //rows: 所有option 資料(Id,Text,Ext)
    static filterByExt(fid, value, rows, box, allItem, addEmptyStr) {
        if (allItem === undefined) {
            allItem = false;
        }
        const obj = _Obj.get(fid, box);
        obj.empty();
        if (addEmptyStr !== '') {
            obj.append(_Str.format('<option value="">{0}</option>', addEmptyStr));
        }
        const len = rows.length;
        for (let i = 0; i < len; i++) {
            const row = rows[i];
            if ((allItem === true && row.Ext === '') || row.Ext == value) {
                obj.append(_Str.format('<option value="{0}">{1}</option>', row.Id, row.Str));
            }
        }
        //選取第0筆
        if (len > 0) {
            this.setIndexO(obj, 0);
        }
    }
    /**
     * onChangeParent -> changeParent
     * 處理2個下拉欄位的連動, 例如:城市-鄉鎮, parent欄位改變時, child欄位的內容也改變
     * param parentFid {string} parent欄位Id
     * param childFid {string} child欄位Id
     * param childId {string} child欄位值, 如果空白表示不設定此欄位值(只更新來源)
     * param action {string} 後端action讀取來源, 固定傳入parentId
     * param isEdit {bool} true(編輯畫面), false(查詢畫面)
     */
    static changeParent(upFid, childFid, childId, action, isEdit) {
        const box = isEdit ? _me.divEdit : _me.divRead;
        const thisId = this.get(upFid, box);
        _Ajax.getJsonA(action, { parentId: thisId }, (rows) => {
            this.setItems(childFid, rows, box);
            if (_Str.notEmpty(childId)) {
                this.set(childFid, childId, box);
            }
        });
    }
}

import _iBase from './_iBase';
import _Obj from './_Obj';
export default class _iText extends _iBase {
    static mask(box) {
        const filter = "[data-mask!='']";
        _Obj.getByFt(filter, box).each(function () {
            const me = $(this);
            me.mask(me.data('mask'));
        });
    }
}

import _iBase from './_iBase';
export default class _iTextarea extends _iBase {
}

import _Var from './_Var';
import _Str from './_Str';
export default class _Json {
    /**
     * add json object into another object
     * param {object} source source object
     * param {object} target target object
     * return {object}
     */
    /*
    static addJson(source: Record<string, any>, target?: Record<string, any>): Record<string, any> {
        if (!target)
            target = {};
        Object.keys(source).map(function (key, index) {
            target[key] = source[key];
        });
        return target;
    }
    */
    /**
     * 轉換一筆json為多筆資料, 用於產生統計圖
     * param from {json}
     * param to {json}
     * return {json} new json data
     */
    static toChartRows(json, cols) {
        const rows = [];
        for (let i = 0; i < cols.length; i++) {
            const fid = cols[i];
            rows.push({ Id: fid, Num: json[fid] });
        }
        return rows;
    }
    /**
     * copy json data
     * param from {json}
     * param to {json}
     * return {json} new json data
     */
    static copy(from, to) {
        const target = to || {};
        for (const key in from) {
            target[key] = from[key];
        }
        return target;
        /*
        Object.keys(from).map(function (key, index) {
            to[key] = from[key];
        });
        */
    }
    /**
     * convert keyValues to json object
     * param keyValues {array} keyValue array
     * param keyId {string} key field id, default to 'Key'
     * param valueId {string} value field id, default to 'Value'
     * return {object} 回傳的json的欄位名稱前面會加上'f'
     */
    static keyValuesToJson(keyValues, keyId, valueId) {
        if (keyValues === null || keyValues.length === 0)
            return null;
        const actualKeyId = keyId || 'Key';
        const actualValueId = valueId || 'Value';
        const data = {};
        for (let i = 0; i < keyValues.length; i++) {
            const row = keyValues[i];
            data['f' + row[actualKeyId]] = row[actualValueId];
        }
        return data;
    }
    //json: object or object array
    static toStr(json) {
        return _Json.isEmpty(json) ? '' : JSON.stringify(json);
    }
    static isEmpty(json) {
        return json == null || $.isEmptyObject(json);
    }
    static notEmpty(json) {
        return !_Json.isEmpty(json);
    }
    static fidIsEmpty(json, fid) {
        return _Json.isEmpty(json)
            ? true
            : _Var.isEmpty(json[fid]);
    }
    static fidNotEmpty(json, fid) {
        return !_Json.fidIsEmpty(json, fid);
    }
    //check is key-value pair
    static isKeyValue(value) {
        return Object.prototype.toString.call(value) === '[object Object]';
    }
    //convert url to json 
    static urlToJson(url) {
        if (url.indexOf('?') > -1) {
            url = url.split('?')[1];
        }
        const pairs = url.split('&');
        const json = {};
        pairs.forEach(function (pairStr) {
            const pair = pairStr.split('=');
            if (pair[0] !== "")
                json[pair[0]] = decodeURIComponent(pair[1] || '');
        });
        return json;
    }
    //convert string to json array
    static strToArray(str) {
        return JSON.parse(str);
    }
    //find jarray
    //return array index
    static findIndex(rows, fid, value) {
        if (rows == null)
            return -1;
        for (let i = 0; i < rows.length; i++) {
            if (rows[i][fid] == value)
                return i;
        }
        //case of not found
        return -1;
    }
    //filter json array
    static filterRows(rows, fid, value) {
        if (rows == null || rows.length == 0)
            return null;
        return rows.filter(function (row) {
            return row[fid] === value;
        });
    }
    //appendRows
    static appendRows(froms, tos) {
        if (froms == null || froms.length == 0)
            return;
        const len = tos.length;
        for (let i = 0; i < froms.length; i++) {
            tos[len + i] = froms[i];
        }
    }
    /**
     * (recursive) remove null for json object
     * param obj {json} by ref
     * param level {int} (default 0) debug purpose, base 0
     * return void
     */
    static removeNull(obj, level) {
        //debugger;
        const currentLevel = level || 0;
        $.each(obj, function (key, value) {
            if (value === null) {
                //delete only null, empty is not !!
                delete obj[key];
            }
            else if (_Json.isKeyValue(value)) {
                _Json.removeNull(value, currentLevel + 1);
            }
            else if (Array.isArray(value)) {
                //check
                const len = value.length;
                if (len == 0) {
                    delete obj[key];
                    return; //continue
                }
                //case of string array
                if (!_Json.isKeyValue(value[0])) {
                    let isEmpty = true;
                    for (let i = 0; i < len; i++) {
                        if (_Str.notEmpty(value[i])) {
                            isEmpty = false;
                            break;
                        }
                    }
                    if (isEmpty)
                        delete obj[key];
                    return; //continue
                }
                //case of json array
                $.each(value, function (k2, v2) {
                    _Json.removeNull(v2, currentLevel + 1);
                    if (_Json.isEmpty(v2))
                        value[k2] = null;
                });
                //check json and remove if need
                let isEmpty = true;
                //from end
                for (let i = len - 1; i >= 0; i--) {
                    if (!_Json.isEmpty(value[i])) {
                        isEmpty = false;
                    }
                    else if (isEmpty) {
                        //delete array element
                        delete value[i];
                    }
                    else {
                        value[i] = null;
                    }
                }
                if (isEmpty)
                    delete obj[key];
            }
        });
        if (_Json.isEmpty(obj)) {
            // Note: assigned to parameter reference, won't affect original root variable, but mimics original JS design
            obj = null;
        }
    }
}

import _Fun from './_Fun';
export default class _Jwt {
    /**
     * get header json object for jwt
     */
    static jsonAddJwtHeader(json) {
        if (_Fun.jwtToken) {
            json.headers = _Jwt.getJwtAuth();
        }
    }
    static getJwtAuth() {
        return {
            'Authorization': _Jwt.getJwtBearer()
        };
    }
    static getJwtBearer() {
        return 'Bearer ' + (_Fun.jwtToken || '');
    }
}

import "bootstrap";
export default class _Leftmenu {
    static menu;
    static init() {
        //set variables
        _Leftmenu.menu = $('.x-leftmenu');
        //_Leftmenu.box = _Leftmenu.menu.parent();
        //_Leftmenu.body = $('#_Body');
        //_Leftmenu.setBoxWidth(true);
        //.css('width', _Leftmenu.menu.data('max-width') + 'px');
        //click時, show/hide 下一個 element, 可省去在panel設定id的步驟
        //for left-menu
        $('.x-toggle').on('click', function (e) {
            e.preventDefault();
            const me = $(this);
            me.next().collapse('toggle');
            const arrow = me.find('.x-arrow');
            const clsName = 'x-open';
            if (arrow.hasClass(clsName)) {
                arrow.removeClass(clsName);
            }
            else {
                arrow.addClass(clsName);
            }
        });
    }
    /*
    //set width for container of left menu
    static setBoxWidth(isOpen: boolean): void {
        var fid = isOpen ? 'max-width' : 'min-width';
        //_Leftmenu.box.css('width', _Leftmenu.menu.data(fid) + 'px');
    }
    */
    static onToggleMenu() {
        _Leftmenu.menu.toggleClass('x-close');
    }
    static getMenuPath(me) {
        const menuName = me.text().trim();
        // 找父層文字
        const parents = [];
        me.parents('li').each(function () {
            const parentLink = $(this).children('.x-toggle');
            if (parentLink.length) {
                parents.unshift(parentLink.text().trim()); // 放到前面，形成正確順序
            }
        });
        // 組合麵包屑
        const fullPath = parents.concat(menuName).join(' > ');
        return fullPath;
    }
}

export default class _Log {
    /**
     * @description 記錄程式時間功能的變數
     */
    static _start = 0; //開始時間
    static _now = 0; //目前時間
    //static _result: string = '';    //目前記錄的內容
    static info(msg) {
        console.log(msg);
    }
    static error(msg) {
        alert(msg);
    }
    /**
     * @description 初始化記錄程式時間功能
     */
    static logTimeInit(name) {
        _Log._start = new Date();
        _Log._now = _Log._start;
        //_result = "\r\n" + name;
        if (name)
            console.log(name);
    }
    /**
     * @description 記錄程式執行時花用的時間
     */
    static logTime(name) {
        const now = new Date();
        //_result += name + ":" + (now - _now) + "/" + (now - _start) + "\r\n";
        const msg = name + ":" + (now - _Log._now) + "/" + (now - _Log._start);
        console.log(msg);
        _Log._now = new Date(); //reset
    }
}

/**
 * modal 多選參考 XpRole/Read.cshtml 選取用戶
 * modal 單選參考 XpRole/Read.cshtml 選取用戶
 */
export default class _Modal {
    //showO -> show
    static show(obj) {
        obj.modal('show');
    }
    //hideO -> hide
    static hide(obj) {
        obj.modal('hide');
    }
}

export default class _Nav {
    static moveLeft(obj) {
        obj.insertBefore(obj.prev());
    }
    static moveRight(obj) {
        obj.insertAfter(obj.next());
    }
}

//數字相關
export default class _Num {
    //是否為數字而且大於(等於)0
    //zeor: 可否為0
    static isBigZero(value, zero) {
        if (isNaN(value))
            return false;
        else if (!zero && (value === '0' || value === 0))
            return false;
        else if (parseInt(value) < 0)
            return false;
        else
            return true;
    }
    static isNum(value) {
        return !isNaN(value);
    }
    static toBool(value) {
        return (value === 1);
    }
    static rowToBool(row, fids) {
        for (let i = 0; i < fids.length; i++) {
            const fid = fids[i];
            row[fid] = _Num.toBool(row[fid]);
        }
        return row;
    }
    //http://www.mredkj.com/javascript/numberFormat.html
    static addComma(str) {
        str += '';
        const x = str.split('.');
        let x1 = x[0];
        const x2 = x.length > 1 ? '.' + x[1] : '';
        const rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }
}

import _Input from './_Input';
import _Var from './_Var';
//操作 jQuery object
export default class _Obj {
    static toAny(obj) {
        return obj;
    }
    static setEdit(obj, status) {
        obj.prop('disabled', !status);
    }
    /**
     * get object by name for input field
     */
    static get(fid, box) {
        return _Obj.getByFt(_Input.fidFilter(fid), box);
    }
    /**
     * getF -> getByFt
     * get object by filter string
     * 傳回JQuery物件, 裡面包含多個 element,
     */
    static getByFt(ft, box) {
        const obj = box.find(ft);
        if (obj.length === 0) {
            return null;
        }
        else {
            return obj;
        }
    }
    /**
     * for none input object
     * get object by id for none input field, like button
     */
    static getById(id, box) {
        return _Obj.getByFt('#' + id, box);
    }
    static getByPreFid(id, box) {
        return _Obj.getByFt('#' + id, box);
    }
    //以下function都傳入object
    /**
     * get id of object
     */
    static getId(obj) {
        return (obj && obj.length > 0) ? (obj.attr('id') || '') : '';
    }
    /**
     * get name of object
     */
    static getName(obj) {
        return (obj && obj.length > 0) ? (obj.attr('name') || '') : '';
    }
    /**
     * check object is visible or not
     */
    static isShow(obj) {
        return obj.is(':visible');
    }
    /**
     * check object existed or not
     */
    static isEmpty(obj) {
        return (obj == null || obj.length === 0);
    }
    /**
     * isExist -> notEmpty
     * check object existed or not
     */
    static notEmpty(obj) {
        return !_Obj.isEmpty(obj);
    }
    /**
     * check object has attribute or not
     * return boolean
     */
    static hasAttr(obj, attr) {
        return obj.attr(attr);
    }
    //如果使用show()/hide()會動態寫入 inline style, 造成CSRF !!
    static show(obj) {
        obj.removeClass('d-none');
    }
    static hide(obj) {
        obj.addClass('d-none');
    }
    //status可能傳入文字!!
    static showByStatus(obj, status) {
        if (_Var.toBool(status)) {
            _Obj.show(obj);
        }
        else {
            _Obj.hide(obj);
        }
    }
    //如果data-屬性不存在會傳回''
    static getData(obj, fid) {
        return obj.attr('data-' + fid) || '';
    }
    /**
     * jquery data() 只寫入 jquery 暫存, 不寫入 DOM !!
     * param {object} obj
     * param {string} fid
     * param {string} value
     */
    static setData(obj, fid, value) {
        obj.attr('data-' + fid, value);
    }
    //傳回小寫tagName
    static tagName(obj) {
        return obj[0].tagName.toLowerCase();
    }
    //rename css class
    static renameCss(obj, oldCss, newCss) {
        obj.removeClass(oldCss).addClass(newCss);
    }
}

import 'jquery-pjax';
import _Leftmenu from './_Leftmenu';
import _Prog from './_Prog';
import _Str from './_Str';
import _Ajax from './_Ajax';
//SPA pjax
export default class _Pjax {
    /**
     * initial
     * param {string} boxFt : box(container) filter
     */
    static init(boxFt) {
        //if skip 'POST', it will trigger twice !!
        const docu = $(document);
        docu.pjax('[data-pjax]', boxFt, { type: 'POST' });
        //點擊功能項目時記錄功能名稱
        docu.on('click', '.x-leftmenu [data-pjax]', function () {
            const menuPath = _Leftmenu.getMenuPath($(this));
            _Prog.storePath(menuPath);
        });
        /*
        //PJAX請求前
        docu.on('pjax:beforeSend', function (event, xhr, opts) {
            if (_Fun.jwtToken)
                xhr.setRequestHeader('Authorization', `Bearer ${_Fun.jwtToken}`);
        });
        */
        //'data' 是後端回傳字串, 可能為 HTML 或錯誤訊息
        docu.on('pjax:success', function (event, data, status, xhr, opts) {
            const json = _Str.toJson(data);
            if (json != null) {
                //只顯示錯誤訊息, 不處理欄位 validation error
                const errMsg = _Ajax.resultToErrMsg(json);
                if (errMsg) {
                    $(opts.container).html(errMsg);
                }
            }
        });
        //when backend exception
        docu.on('pjax:error', function (event, xhr, textStatus, errorThrown, opts) {
            opts.success(xhr.responseText, textStatus, xhr);
            return false;
        });
        //選擇性 binding event
        //xd-bind 只有用在這裡
        //debugger;
        //$('[data-pjax]:not(.xd-bind)').addClass('xd-bind').on('click', function () {
        //    //post submit
        //    //debugger;
        //    /*
        //    */
        //    $(document).on('ready pjax:success', box, function () {
        //        //bindPJAX(target); // Call initializers
        //        init();
        //        $(document).off('ready pjax:success', box); // Unbind initialization
        //    });
        //    /*
        //    $(document).on('pjax:end', function () {
        //        init();
        //        $(document).off('pjax:end');
        //    });
        //    */
        //    // PJAX-load the new content
        //    //debugger;
        //    //$.pjax.click(event, { container: $(box) });
        //    //var path = _Pjax._getPath($(this), '');
        //    var url = $(this).data('pjax');
        //    _Pjax.submit(url, box);
        //});
        /*
        //如果後端驗証失敗, 則取消 submit
        $(document).on('pjax:beforeReplace', function (contents, options) {
        });
        $(document).on('pjax:end', function (data, status, xhr) {
            init();
        });
        */
        //pjax載入完成後必須程式載入.js檔案
        //$(document).on('pjax:success', function (data, status, xhr) {
        //    //_me.initByPjax();
        //    //_me.init();
        //    /*
        //    //先載入 JsLib if need
        //    var jsLib = $('#_JsLib').val();
        //    if (_Str.notEmpty(jsLib)) {
        //        $.getScript('../Scripts/' + jsLib + '.js');
        //    }
        //    //如果view包含_JsView這個hidden欄位, 則表示要載入指定的js檔案,
        //    //否則載入與controller相同名稱的js file
        //    var jsView = $('#_JsView').val();
        //    if (_Str.isEmpty(jsView)) {
        //        //get controller name, 在倒數第2個, js檔案名稱固定為controller小寫
        //        var url = data.currentTarget.URL.replace('//', '/');
        //        if (url.substr(url.length - 1, 1) == '/')
        //            url = url.substr(0, url.length - 1);
        //        var items = url.split('/');
        //        if (items.length >= 4)
        //            jsView = items[items.length - 2].toLowerCase();
        //    }
        //    //載入 jsView
        //    if (_Str.notEmpty(jsView)) {
        //        $.getScript('../Scripts/view/' + jsView + '.js', function (data, textStatus, jqxhr) {
        //            //載入成功後執行 init()
        //            if (typeof (_me) !== 'undefined')
        //                _me.init();
        //        });
        //    }
        //    */
        //});
    }
}

import _Fun from './_Fun';
import _Str from './_Str';
import _Leftmenu from './_Leftmenu';
import FunEstr from '../Enums/FunEstr';
//program, 包含 crud功能
export default class _Prog {
    //filter: '.x-prog-path',
    static me = null; //prog path object
    static initPath = ''; //original path
    static init() {
        _Prog.me = $('.x-prog-path');
        //_Prog.initPath = _Prog.me.text();
        if (_Prog.me.text() == '') {
            //F5 重整時 _Fun.data.progPath 為空
            if (_Str.isEmpty(_Fun.data.progPath)) {
                //url menu -> prog path
                const nowUrl = window.location.pathname;
                const activeLink = $(`.x-leftmenu [href="${nowUrl}"]`);
                const menuPath = _Leftmenu.getMenuPath(activeLink);
                _Prog.storePath(menuPath);
            }
            _Prog.initPath = _Fun.data.progPath;
            _Prog.me.text(_Prog.initPath);
        }
    }
    static setBorder(status) {
        const prog = $('.x-prog');
        if (status)
            prog.removeClass(_Fun.CssFlag);
        else
            prog.addClass(_Fun.CssFlag);
    }
    //storeProgPath -> storePath
    static storePath(progPath) {
        _Fun.data.progPath = progPath;
    }
    //reset path to initial
    static resetPath() {
        _Prog.me.text(_Prog.initPath);
    }
    /**
     * set program path
     * param fun {string} fun mode
     */
    static setPath(fun, updName) {
        const name = (fun == FunEstr.Create) ? _BR.Create :
            (fun == FunEstr.View) ? _BR.View :
                (fun != FunEstr.Update) ? '??' :
                    _Str.isEmpty(updName) ? _BR.Update :
                        updName;
        _Prog.setFunName(name);
    }
    /**
     * set fun name
     * param name {string} fun name
     */
    static setFunName(name) {
        _Prog.me.text(_Prog.initPath + '-' + name);
    }
}

import _Obj from './_Obj';
//https://github.com/davidshimjs/qrcodejs
export default class _Qrcode {
    static set(id, box, url, width) {
        return _Qrcode.setO(_Obj.getById(id, box), url, width);
    }
    static setO(obj, url, width) {
        const qrWidth = width || 128;
        //return new QRCode(document.getElementById(id), {
        return new QRCode(obj[0], {
            text: url,
            width: qrWidth,
            height: qrWidth,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }
}

import _Var from './_Var';
export default class _Str {
    // column separator
    static colSep = '@@';
    /**
     * 前端儲存檔案
     * param str {string} 檔案內容
     * param fileName {string} 下載的檔名
     */
    static saveFile(str, fileName) {
        const blob = new Blob([str], { type: "application/json" });
        // create link & trigger click
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    }
    // variables is empty or not
    static isEmpty(str) {
        return (str === undefined || str === null || str === '');
    }
    static notEmpty(str) {
        return !_Str.isEmpty(str);
    }
    // convert empty string to new string
    static emptyToStr(str, newStr) {
        return _Str.isEmpty(str) ? newStr : str;
    }
    // format string like c# String.Format()
    static format(formatStr, ...args) {
        let str = formatStr;
        for (let i = 0; i < args.length; i++) {
            const reg = new RegExp("\\{" + i + "\\}", "gm");
            str = str.replace(reg, args[i]);
        }
        return str;
    }
    // get mid part string
    static getMid(str, find1, find2) {
        if (_Str.isEmpty(str))
            return '';
        const currentStr = str;
        const pos = currentStr.indexOf(find1);
        if (pos < 0)
            return currentStr;
        const pos2 = currentStr.indexOf(find2, pos + 1);
        return (pos2 < 0)
            ? currentStr.substring(pos + find1.length)
            : currentStr.substring(pos + find1.length, pos2);
    }
    // get tail part string
    static getTail(value, find) {
        const pos = value.lastIndexOf(find);
        return (pos > 0)
            ? value.substring(pos + 1)
            : value;
    }
    static toBool(val) {
        return _Var.toBool(val);
    }
    // 合併多個欄位成為字串
    static colsToStr(firstCol, ...args) {
        let str = firstCol;
        for (let i = 0; i < args.length; i++)
            str += _Str.colSep + args[i];
        return str;
    }
    static trim(str) {
        return str.trim();
    }
    static toJson(str) {
        try {
            return JSON.parse(str);
        }
        catch (error) {
            return null;
        }
    }
    static replaceAll(str, oldStr, newStr) {
        // 轉義特殊字元，避免錯誤正則
        const oldStr2 = oldStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(oldStr2, 'g');
        return str.replace(regex, newStr);
    }
}

import _Str from './_Str';
export default class _Switch {
    /**
     * 傳回元件內容字串 for client render
     */
    static getText(yes, no, width, status, inline, fid, cls) {
        const inline2 = inline ? ' x-inline' : '';
        let attr = fid ? ` id="${fid}"` : '';
        if (status) {
            attr += ' checked';
        }
        cls = cls ? ` ${cls}` : '';
        const html = '' +
            '<label class="switch{5}" style="width:{2}px;">' +
            '<input{3} class="switch-input{4}" type="checkbox" />' +
            '<span class="switch-label" data-on="{0}" data-off="{1}"></span>' +
            '<span class="switch-handle"></span>' +
            '</label>';
        return _Str.format(html, yes, no, width, attr, cls, inline2);
    }
}

export default class _Tab {
    static moveLeft(obj) {
        obj.insertBefore(obj.prev());
    }
    static moveRight(obj) {
        obj.insertAfter(obj.next());
    }
}

import _Input from './_Input';
import _Fun from './_Fun';
export default class _Table {
    /**
     * 讀取某個欄位值
     * 傳回字串陣列
     */
    static getFidValues(box, trFilter, fid) {
        const ary = []; // return array
        box.find(trFilter).each((_idx, trElm) => {
            const key = _Input.get(fid, $(trElm));
            ary.push(key);
        });
        return ary;
    }
    /**
     * btn: fun button in tr
     */
    static rowMoveUp() {
        const row = _Fun.getMe().closest('tr');
        row.insertBefore(row.prev());
    }
    static rowMoveDown() {
        const row = _Fun.getMe().closest('tr');
        row.insertAfter(row.next());
    }
    /**
     * get rows count
     * @param table table object
     * @param fid field id(name attribute)
     * @returns rows count
     */
    static getRowCount(table, fid) {
        return table.find(_Input.fidFilter(fid)).length;
    }
}

export default class _Temp {
}

export default class _Time {
    /**
     * 延遲指定的毫秒數
     * @param ms 延遲毫秒數
     */
    static async sleepA(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

import _Modal from './_Modal';
import _Obj from './_Obj';
import _iTextarea from './_iTextarea';
import _Btn from './_Btn';
export default class _Tool {
    // constant
    // msg text
    static FltMsgText = '.xd-msg';
    // variables for ansA
    static ansStatus = false;
    static fnResolve = null;
    static xMsg;
    static xAns;
    static xAnsA;
    static xAlert;
    static xArea;
    static xImage;
    static xWork;
    static _fnOnMsgClose = null;
    static _fnOnAnsYes = null;
    static _fnOnAnsNo = null;
    static _fnOnAreaYes = null;
    static init() {
        // alert
        _Tool.xMsg = $('#xMsg'); // 使用id
        _Tool.xAns = $('#xAns'); // 使用id
        _Tool.xAnsA = $('#xAnsA'); // 使用id, 非同步
        _Tool.xAlert = $('.x-alert');
        _Tool.xArea = $('.x-area');
        _Tool.xImage = $('.x-image');
        _Tool.xWork = $('.x-work');
    }
    /**
     * show message box
     * @param msg html or string
     * @param fnClose callback function
     */
    static msg(msg, fnClose) {
        const box = _Tool.xMsg;
        box.find(_Tool.FltMsgText).html(msg);
        _Modal.show(box);
        // set callback
        _Tool._fnOnMsgClose = fnClose;
    }
    /**
     * show confirmation
     * @param msg
     * @param fnYes
     * @param fnNo
     */
    static ans(msg, fnYes, fnNo) {
        const box = _Tool.xAns;
        box.find(_Tool.FltMsgText).html(msg);
        _Modal.show(box);
        // set callback
        _Tool._fnOnAnsYes = fnYes;
        _Tool._fnOnAnsNo = (fnNo === undefined) ? null : fnNo;
    }
    /**
     * 非同步方式, 比callback function(promise)方便
     * show confirmation
     * @param msg
     * @return yes/no
     */
    static async ansA(msg) {
        const box = _Tool.xAnsA;
        box.find(_Tool.FltMsgText).html(msg);
        _Modal.show(box);
        return new Promise((resolve) => {
            // reset flag, 防止重複 resolve
            _Tool.ansStatus = false;
            _Tool.fnResolve = resolve;
        });
    }
    // called by ansA yes/no onclick event
    static onAnsA(value) {
        if (_Tool.ansStatus)
            return;
        _Tool.ansStatus = true;
        _Modal.hide(_Tool.xAnsA);
        if (_Tool.fnResolve) {
            _Tool.fnResolve(value == 1);
        }
    }
    /**
     * show alert(auto close), use bootstrap alert
     * @param msg
     * @param color default blue, R(red)
     */
    static alert(msg, color) {
        const box = _Tool.xAlert;
        box.find(_Tool.FltMsgText).text(msg);
        box.fadeIn(500, function () {
            _Obj.show(box);
            setTimeout(function () {
                _Tool.onAlertClose();
            }, 5000); // show 5 seconds
        });
    }
    // ??show waiting
    static showWait() {
        _Obj.show(_Tool.xAlert);
    }
    // ??
    static hideWait() {
        _Obj.hide(_Tool.xAlert);
    }
    /**
     * show textarea editor
     * @param title modal title
     * @param value textarea value
     * @param isEdit true:edit, false:readonly
     * @param fnOk function of onOk
     */
    static showArea(title, value, isEdit, fnOk) {
        // set title
        const box = _Tool.xArea;
        box.find('.modal-title').text(title);
        // get value & yes button status
        const obj = box.find('textarea');
        obj.val(value);
        _iTextarea.setEditO(obj, isEdit);
        _Btn.setEdit(box.find('.xd-yes'), isEdit);
        // set callback function
        if (isEdit) {
            _Tool._fnOnAreaYes = fnOk;
        }
        // show modal
        _Modal.show(box);
    }
    static onAreaYes() {
        const box = _Tool.xArea;
        if (_Tool._fnOnAreaYes) {
            _Modal.hide(box);
            const value = box.find('textarea').val();
            _Tool._fnOnAreaYes(value);
        }
    }
    /**
     * show image modal
     * @param fileName image file name without path
     * @param imageSrc image src
     */
    static showImage(fileName, imageSrc) {
        const box = _Tool.xImage;
        box.find('img').attr('src', imageSrc);
        box.find('label').text(fileName);
        _Modal.show(box);
    }
    /**
     * onclick alert close button
     */
    static onAlertClose() {
        const box = _Tool.xAlert;
        box.fadeOut(500, function () {
            _Obj.hide(box);
        });
    }
    /**
     * triggered when user click confirmation yes button
     * called by XgAnsHelper
     */
    static onAnsYes() {
        if (_Tool._fnOnAnsYes) {
            _Modal.hide(_Tool.xAns);
            _Tool._fnOnAnsYes();
        }
    }
    static onAnsNo() {
        if (_Tool._fnOnAnsNo) {
            _Tool._fnOnAnsNo();
        }
        _Modal.hide(_Tool.xAns);
    }
    static onMsgClose() {
        if (_Tool._fnOnMsgClose) {
            _Tool._fnOnMsgClose();
        }
        _Modal.hide(_Tool.xMsg);
    }
}

import _Str from './_Str';
import _Obj from './_Obj';
export default class _Valid {
    /**
     * initial jQuery Validation
     * @param form form object
     * @returns validator object
     */
    static init(form) {
        //remove data first
        form.removeData('validator');
        //config
        const config = {
            ignore: ':hidden:not(.xd-valid), .note-editable.panel-body, .xi-read',
            errorElement: 'span',
            errorPlacement: function (error, elm) {
                error.insertAfter(_Valid._getBox($(elm)));
                return false;
            },
            //顯示validation錯誤
            highlight: function (elm, errorClass, validClass) {
                const me = $(elm);
                const box = _Valid._getBox(me);
                box.removeClass(validClass).addClass(errorClass);
                const errObj = _Valid._getError(me);
                if (errObj != null) {
                    _Obj.show(errObj);
                }
                return false;
            },
            //清除validation錯誤
            unhighlight: function (elm, errorClass, validClass) {
                const me = $(elm);
                const box = _Valid._getBox(me);
                box.removeClass(errorClass).addClass(validClass);
                const errObj = _Valid._getError(me);
                if (errObj != null) {
                    _Obj.hide(errObj);
                }
                return false;
            },
        };
        return form.validate(config);
    }
    /**
     * 使用 jquery validation方式顯示錯誤, 通知由後端傳回錯誤, 再前端顯示
     * @param fid field id
     * @param msg error msg
     * @param eformId (optional for 多筆) 若為多筆則必須配合rowId找到fid
     * @param rowId (optional for 多筆) row Id valud
     */
    static showError(fid, msg, eformId, rowId) {
        const eform = _Str.isEmpty(eformId) ? _me.eform0 : $('#' + eformId);
        eform.validator.showErrors({
            [fid]: msg
        });
    }
    static _getBox(obj) {
        //closest will check this first !!
        return obj.closest('.xi-box');
    }
    /**
     * get error object
     * @param obj input object
     */
    static _getError(obj) {
        const error = _Valid._getBox(obj).next();
        return (error.length == 1 && error.hasClass('error') && error.is('span'))
            ? error : null;
    }
}

import _Str from './_Str';
export default class _Var {
    static preZero(len, value) {
        return String(value).padStart(len, '0');
    }
    static emptyToValue(var1, value) {
        return _Str.isEmpty(var1) ? value : var1;
    }
    // variables is empty or not
    static isEmpty(var1) {
        return (var1 === undefined || var1 === null || var1 === '');
    }
    static isStr(var1) {
        return (typeof var1 === 'string');
    }
    static notEmpty(var1) {
        return !_Var.isEmpty(var1);
    }
    // check not object、array
    static isPureData(value) {
        return (typeof value !== 'object' && !Array.isArray(value));
    }
    // 使用 == 模型比對即可 !!
    static toBool(val) {
        return (val == '1' || val == true || val == 'True');
    }
}
