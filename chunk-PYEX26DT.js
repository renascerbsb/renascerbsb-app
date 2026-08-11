import{A as Z,B as Y,C as me,D as _e,Db as kt,E as lt,G as ot,Ha as He,Ja as ce,Ka as Se,La as mt,Na as _t,Pa as we,Qa as M,Ra as Oe,S as xe,T as J,Ua as ht,V as at,Va as gt,W as rt,Wa as ft,Xa as bt,Y as st,Ya as yt,_a as vt,ca as Ce,eb as It,f as Ie,g as Xe,gb as ke,h as ue,ha as ct,hb as Ne,i as et,j as U,ja as pt,jb as xt,ka as dt,kb as Ct,l as W,la as ut,ma as re,na as V,oa as X,ob as Tt,pa as se,ra as Te,rb as St,sb as wt,t as tt,u as it,ub as Ot,va as Pe,ya as ze,z as nt}from"./chunk-GDE3ZXYN.js";import{$a as le,$b as ae,Ab as Ae,Cb as N,Db as d,Eb as B,Fb as R,Ga as fe,Gb as ve,Ib as We,Jb as Ze,Kb as Ye,L as ge,La as D,Lb as G,M as H,Ma as te,Mb as De,N as ee,Nb as E,Ob as de,P as K,Pa as ie,Pb as Je,Q as je,Qa as P,R as k,Ra as p,W as v,X as I,Xa as f,Xb as F,Y as A,_a as ne,a as $e,b as Ke,ba as S,ca as qe,cb as r,db as m,dc as $,eb as _,fb as z,ga as j,gb as Fe,hb as Le,ib as Be,ja as Ge,jb as C,jc as b,kb as T,kc as Q,la as L,lb as w,mb as O,nb as Ue,qb as x,sb as s,tb as be,ub as pe,vb as oe,wa as Qe,wb as ye,xb as h,ya as c,yb as g,zb as q}from"./chunk-M4E2PQMT.js";var Mt=class t{constructor(a){this.http=a}apiUrl=`${kt.apiUrl}/filiais-trajetorias/`;listar(a={}){return this.http.get(this.apiUrl,{params:this.montarParams(a)})}buscarPorId(a,e){return this.http.get(`${this.apiUrl}${a}/${e}`)}criar(a){return this.http.post(this.apiUrl,a)}atualizar(a,e,n){return this.http.put(`${this.apiUrl}${a}/${e}`,n)}inativar(a,e){return this.http.delete(`${this.apiUrl}${a}/${e}`)}montarParams(a){let e=new tt;return Object.entries(a).forEach(([n,i])=>{i!=null&&(e=e.set(n,String(i)))}),e}static \u0275fac=function(e){return new(e||t)(je(it))};static \u0275prov=H({token:t,factory:t.\u0275fac,providedIn:"root"})};var Qt=["data-p-icon","times-circle"],Vt=(()=>{class t extends gt{pathId;onInit(){this.pathId="url(#"+Ce()+")"}static \u0275fac=(()=>{let e;return function(i){return(e||(e=L(t)))(i||t)}})();static \u0275cmp=D({type:t,selectors:[["","data-p-icon","times-circle"]],features:[P],attrs:Qt,decls:5,vars:2,consts:[["fill-rule","evenodd","clip-rule","evenodd","d","M7 14C5.61553 14 4.26215 13.5895 3.11101 12.8203C1.95987 12.0511 1.06266 10.9579 0.532846 9.67879C0.00303296 8.3997 -0.13559 6.99224 0.134506 5.63437C0.404603 4.2765 1.07129 3.02922 2.05026 2.05026C3.02922 1.07129 4.2765 0.404603 5.63437 0.134506C6.99224 -0.13559 8.3997 0.00303296 9.67879 0.532846C10.9579 1.06266 12.0511 1.95987 12.8203 3.11101C13.5895 4.26215 14 5.61553 14 7C14 8.85652 13.2625 10.637 11.9497 11.9497C10.637 13.2625 8.85652 14 7 14ZM7 1.16667C5.84628 1.16667 4.71846 1.50879 3.75918 2.14976C2.79989 2.79074 2.05222 3.70178 1.61071 4.76768C1.16919 5.83358 1.05367 7.00647 1.27876 8.13803C1.50384 9.26958 2.05941 10.309 2.87521 11.1248C3.69102 11.9406 4.73042 12.4962 5.86198 12.7212C6.99353 12.9463 8.16642 12.8308 9.23232 12.3893C10.2982 11.9478 11.2093 11.2001 11.8502 10.2408C12.4912 9.28154 12.8333 8.15373 12.8333 7C12.8333 5.45291 12.2188 3.96918 11.1248 2.87521C10.0308 1.78125 8.5471 1.16667 7 1.16667ZM4.66662 9.91668C4.58998 9.91704 4.51404 9.90209 4.44325 9.87271C4.37246 9.84333 4.30826 9.8001 4.2544 9.74557C4.14516 9.6362 4.0838 9.48793 4.0838 9.33335C4.0838 9.17876 4.14516 9.0305 4.2544 8.92113L6.17553 7L4.25443 5.07891C4.15139 4.96832 4.09529 4.82207 4.09796 4.67094C4.10063 4.51982 4.16185 4.37563 4.26872 4.26876C4.3756 4.16188 4.51979 4.10066 4.67091 4.09799C4.82204 4.09532 4.96829 4.15142 5.07887 4.25446L6.99997 6.17556L8.92106 4.25446C9.03164 4.15142 9.1779 4.09532 9.32903 4.09799C9.48015 4.10066 9.62434 4.16188 9.73121 4.26876C9.83809 4.37563 9.89931 4.51982 9.90198 4.67094C9.90464 4.82207 9.84855 4.96832 9.74551 5.07891L7.82441 7L9.74554 8.92113C9.85478 9.0305 9.91614 9.17876 9.91614 9.33335C9.91614 9.48793 9.85478 9.6362 9.74554 9.74557C9.69168 9.8001 9.62748 9.84333 9.55669 9.87271C9.4859 9.90209 9.40996 9.91704 9.33332 9.91668C9.25668 9.91704 9.18073 9.90209 9.10995 9.87271C9.03916 9.84333 8.97495 9.8001 8.9211 9.74557L6.99997 7.82444L5.07884 9.74557C5.02499 9.8001 4.96078 9.84333 4.88999 9.87271C4.81921 9.90209 4.74326 9.91704 4.66662 9.91668Z","fill","currentColor"],[3,"id"],["width","14","height","14","fill","white"]],template:function(n,i){n&1&&(A(),Fe(0,"g"),Be(1,"path",0),Le(),Fe(2,"defs")(3,"clipPath",1),Be(4,"rect",2),Le()()),n&2&&(f("clip-path",i.pathId),c(3),Ue("id",i.pathId))},encapsulation:2})}return t})();var Et=`
    .p-chip {
        display: inline-flex;
        align-items: center;
        background: dt('chip.background');
        color: dt('chip.color');
        border-radius: dt('chip.border.radius');
        padding-block: dt('chip.padding.y');
        padding-inline: dt('chip.padding.x');
        gap: dt('chip.gap');
    }

    .p-chip-icon {
        color: dt('chip.icon.color');
        font-size: dt('chip.icon.size');
        width: dt('chip.icon.size');
        height: dt('chip.icon.size');
    }

    .p-chip-image {
        border-radius: 50%;
        width: dt('chip.image.width');
        height: dt('chip.image.height');
        margin-inline-start: calc(-1 * dt('chip.padding.y'));
    }

    .p-chip:has(.p-chip-remove-icon) {
        padding-inline-end: dt('chip.padding.y');
    }

    .p-chip:has(.p-chip-image) {
        padding-block-start: calc(dt('chip.padding.y') / 2);
        padding-block-end: calc(dt('chip.padding.y') / 2);
    }

    .p-chip-remove-icon {
        cursor: pointer;
        font-size: dt('chip.remove.icon.size');
        width: dt('chip.remove.icon.size');
        height: dt('chip.remove.icon.size');
        color: dt('chip.remove.icon.color');
        border-radius: 50%;
        transition:
            outline-color dt('chip.transition.duration'),
            box-shadow dt('chip.transition.duration');
        outline-color: transparent;
    }

    .p-chip-remove-icon:focus-visible {
        box-shadow: dt('chip.remove.icon.focus.ring.shadow');
        outline: dt('chip.remove.icon.focus.ring.width') dt('chip.remove.icon.focus.ring.style') dt('chip.remove.icon.focus.ring.color');
        outline-offset: dt('chip.remove.icon.focus.ring.offset');
    }
`;var Ut=["removeicon"],Wt=["*"];function Zt(t,a){if(t&1){let e=O();m(0,"img",4),x("error",function(i){v(e);let l=s();return I(l.imageError(i))}),_()}if(t&2){let e=s();d(e.cx("image")),r("pBind",e.ptm("image"))("src",e.image,Qe)("alt",e.alt)}}function Yt(t,a){if(t&1&&z(0,"span",6),t&2){let e=s(2);d(e.icon),r("pBind",e.ptm("icon"))("ngClass",e.cx("icon"))}}function Jt(t,a){if(t&1&&p(0,Yt,1,4,"span",5),t&2){let e=s();r("ngIf",e.icon)}}function Xt(t,a){if(t&1&&(m(0,"div",7),B(1),_()),t&2){let e=s();d(e.cx("label")),r("pBind",e.ptm("label")),c(),R(e.label)}}function ei(t,a){if(t&1){let e=O();m(0,"span",11),x("click",function(i){v(e);let l=s(3);return I(l.close(i))})("keydown",function(i){v(e);let l=s(3);return I(l.onKeydown(i))}),_()}if(t&2){let e=s(3);d(e.removeIcon),r("pBind",e.ptm("removeIcon"))("ngClass",e.cx("removeIcon")),f("tabindex",e.disabled?-1:0)("aria-label",e.removeAriaLabel)}}function ti(t,a){if(t&1){let e=O();A(),m(0,"svg",12),x("click",function(i){v(e);let l=s(3);return I(l.close(i))})("keydown",function(i){v(e);let l=s(3);return I(l.onKeydown(i))}),_()}if(t&2){let e=s(3);d(e.cx("removeIcon")),r("pBind",e.ptm("removeIcon")),f("tabindex",e.disabled?-1:0)("aria-label",e.removeAriaLabel)}}function ii(t,a){if(t&1&&(C(0),p(1,ei,1,6,"span",9)(2,ti,1,5,"svg",10),T()),t&2){let e=s(2);c(),r("ngIf",e.removeIcon),c(),r("ngIf",!e.removeIcon)}}function ni(t,a){}function li(t,a){t&1&&p(0,ni,0,0,"ng-template")}function oi(t,a){if(t&1){let e=O();m(0,"span",13),x("click",function(i){v(e);let l=s(2);return I(l.close(i))})("keydown",function(i){v(e);let l=s(2);return I(l.onKeydown(i))}),p(1,li,1,0,null,14),_()}if(t&2){let e=s(2);d(e.cx("removeIcon")),r("pBind",e.ptm("removeIcon")),f("tabindex",e.disabled?-1:0)("aria-label",e.removeAriaLabel),c(),r("ngTemplateOutlet",e.removeIconTemplate||e._removeIconTemplate)}}function ai(t,a){if(t&1&&(C(0),p(1,ii,3,2,"ng-container",3)(2,oi,2,6,"span",8),T()),t&2){let e=s();c(),r("ngIf",!e.removeIconTemplate&&!e._removeIconTemplate),c(),r("ngIf",e.removeIconTemplate||e._removeIconTemplate)}}var ri={root:({instance:t})=>({display:!t.visible&&"none"})},si={root:({instance:t})=>["p-chip p-component",{"p-disabled":t.disabled}],image:"p-chip-image",icon:"p-chip-icon",label:"p-chip-label",removeIcon:"p-chip-remove-icon"},Ft=(()=>{class t extends se{name="chip";style=Et;classes=si;inlineStyles=ri;static \u0275fac=(()=>{let e;return function(i){return(e||(e=L(t)))(i||t)}})();static \u0275prov=H({token:t,factory:t.\u0275fac})}return t})();var Lt=new K("CHIP_INSTANCE"),Re=(()=>{class t extends Se{componentName="Chip";$pcChip=k(Lt,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=k(M,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}label;icon;image;alt;styleClass;disabled=!1;removable=!1;removeIcon;onRemove=new S;onImageError=new S;visible=!0;get removeAriaLabel(){return this.config.getTranslation(X.ARIA).removeLabel}get chipProps(){return this._chipProps}set chipProps(e){this._chipProps=e,e&&typeof e=="object"&&Object.entries(e).forEach(([n,i])=>this[`_${n}`]!==i&&(this[`_${n}`]=i))}_chipProps;_componentStyle=k(Ft);removeIconTemplate;templates;_removeIconTemplate;onAfterContentInit(){this.templates.forEach(e=>{e.getType()==="removeicon"?this._removeIconTemplate=e.template:this._removeIconTemplate=e.template})}onChanges(e){if(e.chipProps&&e.chipProps.currentValue){let{currentValue:n}=e.chipProps;n.label!==void 0&&(this.label=n.label),n.icon!==void 0&&(this.icon=n.icon),n.image!==void 0&&(this.image=n.image),n.alt!==void 0&&(this.alt=n.alt),n.styleClass!==void 0&&(this.styleClass=n.styleClass),n.removable!==void 0&&(this.removable=n.removable),n.removeIcon!==void 0&&(this.removeIcon=n.removeIcon)}}close(e){this.visible=!1,this.onRemove.emit(e)}onKeydown(e){(e.key==="Enter"||e.key==="Backspace")&&this.close(e)}imageError(e){this.onImageError.emit(e)}get dataP(){return this.cn({removable:this.removable})}static \u0275fac=(()=>{let e;return function(i){return(e||(e=L(t)))(i||t)}})();static \u0275cmp=D({type:t,selectors:[["p-chip"]],contentQueries:function(n,i,l){if(n&1&&oe(l,Ut,4)(l,re,4),n&2){let o;h(o=g())&&(i.removeIconTemplate=o.first),h(o=g())&&(i.templates=o)}},hostVars:6,hostBindings:function(n,i){n&2&&(f("aria-label",i.label)("data-p",i.dataP),N(i.sx("root")),d(i.cn(i.cx("root"),i.styleClass)))},inputs:{label:"label",icon:"icon",image:"image",alt:"alt",styleClass:"styleClass",disabled:[2,"disabled","disabled",b],removable:[2,"removable","removable",b],removeIcon:"removeIcon",chipProps:"chipProps"},outputs:{onRemove:"onRemove",onImageError:"onImageError"},features:[G([Ft,{provide:Lt,useExisting:t},{provide:ce,useExisting:t}]),ie([M]),P],ngContentSelectors:Wt,decls:6,vars:4,consts:[["iconTemplate",""],[3,"pBind","class","src","alt","error",4,"ngIf","ngIfElse"],[3,"pBind","class",4,"ngIf"],[4,"ngIf"],[3,"error","pBind","src","alt"],[3,"pBind","class","ngClass",4,"ngIf"],[3,"pBind","ngClass"],[3,"pBind"],["role","button",3,"pBind","class","click","keydown",4,"ngIf"],["role","button",3,"pBind","class","ngClass","click","keydown",4,"ngIf"],["data-p-icon","times-circle","role","button",3,"pBind","class","click","keydown",4,"ngIf"],["role","button",3,"click","keydown","pBind","ngClass"],["data-p-icon","times-circle","role","button",3,"click","keydown","pBind"],["role","button",3,"click","keydown","pBind"],[4,"ngTemplateOutlet"]],template:function(n,i){if(n&1&&(be(),pe(0),p(1,Zt,1,5,"img",1)(2,Jt,1,1,"ng-template",null,0,F)(4,Xt,2,4,"div",2)(5,ai,3,2,"ng-container",3)),n&2){let l=q(3);c(),r("ngIf",i.image)("ngIfElse",l),c(3),r("ngIf",i.label),c(),r("ngIf",i.removable)}},dependencies:[W,Ie,ue,U,Vt,V,M],encapsulation:2,changeDetection:0})}return t})(),io=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=te({type:t});static \u0275inj=ee({imports:[Re,V,V]})}return t})();var Dt=`
    .p-multiselect {
        display: inline-flex;
        cursor: pointer;
        position: relative;
        user-select: none;
        background: dt('multiselect.background');
        border: 1px solid dt('multiselect.border.color');
        transition:
            background dt('multiselect.transition.duration'),
            color dt('multiselect.transition.duration'),
            border-color dt('multiselect.transition.duration'),
            outline-color dt('multiselect.transition.duration'),
            box-shadow dt('multiselect.transition.duration');
        border-radius: dt('multiselect.border.radius');
        outline-color: transparent;
        box-shadow: dt('multiselect.shadow');
    }

    .p-multiselect:not(.p-disabled):hover {
        border-color: dt('multiselect.hover.border.color');
    }

    .p-multiselect:not(.p-disabled).p-focus {
        border-color: dt('multiselect.focus.border.color');
        box-shadow: dt('multiselect.focus.ring.shadow');
        outline: dt('multiselect.focus.ring.width') dt('multiselect.focus.ring.style') dt('multiselect.focus.ring.color');
        outline-offset: dt('multiselect.focus.ring.offset');
    }

    .p-multiselect.p-variant-filled {
        background: dt('multiselect.filled.background');
    }

    .p-multiselect.p-variant-filled:not(.p-disabled):hover {
        background: dt('multiselect.filled.hover.background');
    }

    .p-multiselect.p-variant-filled.p-focus {
        background: dt('multiselect.filled.focus.background');
    }

    .p-multiselect.p-invalid {
        border-color: dt('multiselect.invalid.border.color');
    }

    .p-multiselect.p-disabled {
        opacity: 1;
        background: dt('multiselect.disabled.background');
    }

    .p-multiselect-dropdown {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        background: transparent;
        color: dt('multiselect.dropdown.color');
        width: dt('multiselect.dropdown.width');
        border-start-end-radius: dt('multiselect.border.radius');
        border-end-end-radius: dt('multiselect.border.radius');
    }

    .p-multiselect-clear-icon {
        align-self: center;
        color: dt('multiselect.clear.icon.color');
        inset-inline-end: dt('multiselect.dropdown.width');
    }

    .p-multiselect-label-container {
        overflow: hidden;
        flex: 1 1 auto;
        cursor: pointer;
    }

    .p-multiselect-label {
        white-space: nowrap;
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: dt('multiselect.padding.y') dt('multiselect.padding.x');
        color: dt('multiselect.color');
    }

    .p-multiselect-display-chip .p-multiselect-label {
        display: flex;
        align-items: center;
        gap: calc(dt('multiselect.padding.y') / 2);
    }

    .p-multiselect-label.p-placeholder {
        color: dt('multiselect.placeholder.color');
    }

    .p-multiselect.p-invalid .p-multiselect-label.p-placeholder {
        color: dt('multiselect.invalid.placeholder.color');
    }

    .p-multiselect.p-disabled .p-multiselect-label {
        color: dt('multiselect.disabled.color');
    }

    .p-multiselect-label-empty {
        overflow: hidden;
        visibility: hidden;
    }

    .p-multiselect-overlay {
        position: absolute;
        top: 0;
        left: 0;
        background: dt('multiselect.overlay.background');
        color: dt('multiselect.overlay.color');
        border: 1px solid dt('multiselect.overlay.border.color');
        border-radius: dt('multiselect.overlay.border.radius');
        box-shadow: dt('multiselect.overlay.shadow');
        min-width: 100%;
    }

    .p-multiselect-header {
        display: flex;
        align-items: center;
        padding: dt('multiselect.list.header.padding');
    }

    .p-multiselect-header .p-checkbox {
        margin-inline-end: dt('multiselect.option.gap');
    }

    .p-multiselect-filter-container {
        flex: 1 1 auto;
    }

    .p-multiselect-filter {
        width: 100%;
    }

    .p-multiselect-list-container {
        overflow: auto;
    }

    .p-multiselect-list {
        margin: 0;
        padding: 0;
        list-style-type: none;
        padding: dt('multiselect.list.padding');
        display: flex;
        flex-direction: column;
        gap: dt('multiselect.list.gap');
    }

    .p-multiselect-option {
        cursor: pointer;
        font-weight: normal;
        white-space: nowrap;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        gap: dt('multiselect.option.gap');
        padding: dt('multiselect.option.padding');
        border: 0 none;
        color: dt('multiselect.option.color');
        background: transparent;
        transition:
            background dt('multiselect.transition.duration'),
            color dt('multiselect.transition.duration'),
            border-color dt('multiselect.transition.duration'),
            box-shadow dt('multiselect.transition.duration'),
            outline-color dt('multiselect.transition.duration');
        border-radius: dt('multiselect.option.border.radius');
    }

    .p-multiselect-option:not(.p-multiselect-option-selected):not(.p-disabled).p-focus {
        background: dt('multiselect.option.focus.background');
        color: dt('multiselect.option.focus.color');
    }

    .p-multiselect-option:not(.p-multiselect-option-selected):not(.p-disabled):hover {
        background: dt('multiselect.option.focus.background');
        color: dt('multiselect.option.focus.color');
    }

    .p-multiselect-option.p-multiselect-option-selected {
        background: dt('multiselect.option.selected.background');
        color: dt('multiselect.option.selected.color');
    }

    .p-multiselect-option.p-multiselect-option-selected.p-focus {
        background: dt('multiselect.option.selected.focus.background');
        color: dt('multiselect.option.selected.focus.color');
    }

    .p-multiselect-option-group {
        cursor: auto;
        margin: 0;
        padding: dt('multiselect.option.group.padding');
        background: dt('multiselect.option.group.background');
        color: dt('multiselect.option.group.color');
        font-weight: dt('multiselect.option.group.font.weight');
    }

    .p-multiselect-empty-message {
        padding: dt('multiselect.empty.message.padding');
    }

    .p-multiselect-label .p-chip {
        padding-block-start: calc(dt('multiselect.padding.y') / 2);
        padding-block-end: calc(dt('multiselect.padding.y') / 2);
        border-radius: dt('multiselect.chip.border.radius');
    }

    .p-multiselect-label:has(.p-chip) {
        padding: calc(dt('multiselect.padding.y') / 2) calc(dt('multiselect.padding.x') / 2);
    }

    .p-multiselect-fluid {
        display: flex;
        width: 100%;
    }

    .p-multiselect-sm .p-multiselect-label {
        font-size: dt('multiselect.sm.font.size');
        padding-block: dt('multiselect.sm.padding.y');
        padding-inline: dt('multiselect.sm.padding.x');
    }

    .p-multiselect-sm .p-multiselect-dropdown .p-icon {
        font-size: dt('multiselect.sm.font.size');
        width: dt('multiselect.sm.font.size');
        height: dt('multiselect.sm.font.size');
    }

    .p-multiselect-lg .p-multiselect-label {
        font-size: dt('multiselect.lg.font.size');
        padding-block: dt('multiselect.lg.padding.y');
        padding-inline: dt('multiselect.lg.padding.x');
    }

    .p-multiselect-lg .p-multiselect-dropdown .p-icon {
        font-size: dt('multiselect.lg.font.size');
        width: dt('multiselect.lg.font.size');
        height: dt('multiselect.lg.font.size');
    }

    .p-floatlabel-in .p-multiselect-filter {
        padding-block-start: dt('multiselect.padding.y');
        padding-block-end: dt('multiselect.padding.y');
    }
`;var ci=["pMultiSelectItem",""],zt=t=>({$implicit:t}),pi=(t,a)=>({checked:t,class:a});function di(t,a){}function ui(t,a){t&1&&p(0,di,0,0,"ng-template")}function mi(t,a){if(t&1&&p(0,ui,1,0,null,3),t&2){let e=a.class,n=s(2);r("ngTemplateOutlet",n.itemCheckboxIconTemplate)("ngTemplateOutletContext",de(2,pi,n.selected,e))}}function _i(t,a){t&1&&(C(0),p(1,mi,1,5,"ng-template",null,0,F),T())}function hi(t,a){if(t&1&&(m(0,"span"),B(1),_()),t&2){let e=s();c(),R(e.label??"empty")}}function gi(t,a){t&1&&w(0)}var fi=["item"],bi=["group"],yi=["loader"],vi=["header"],Ii=["filter"],xi=["footer"],Ci=["emptyfilter"],Ti=["empty"],Si=["selecteditems"],wi=["loadingicon"],Oi=["filtericon"],ki=["removetokenicon"],Mi=["chipicon"],Vi=["clearicon"],Ei=["dropdownicon"],Fi=["itemcheckboxicon"],Li=["headercheckboxicon"],Bi=["overlay"],Ai=["filterInput"],Di=["focusInput"],Pi=["items"],zi=["scroller"],Hi=["lastHiddenFocusableEl"],Ni=["firstHiddenFocusableEl"],Ri=["headerCheckbox"],$i=[[["p-header"]],[["p-footer"]]],Ki=["p-header","p-footer"],ji=()=>({class:"p-multiselect-chip-icon"}),qi=(t,a)=>({$implicit:t,removeChip:a}),Gi=t=>({dataP:t}),Ht=t=>({options:t}),Qi=(t,a,e)=>({checked:t,partialSelected:a,class:e}),Ee=t=>({height:t}),Nt=(t,a)=>({$implicit:t,options:a}),Ui=()=>({});function Wi(t,a){if(t&1&&(C(0),B(1),T()),t&2){let e=s(2);c(),R(e.label()||"empty")}}function Zi(t,a){if(t&1&&B(0),t&2){let e=s(3);ve(" ",e.getSelectedItemsLabel()," ")}}function Yi(t,a){t&1&&w(0)}function Ji(t,a){if(t&1){let e=O();m(0,"span",27),x("click",function(i){v(e);let l=s(4).$implicit,o=s(4);return I(o.removeOption(l,i))}),p(1,Yi,1,0,"ng-container",28),_()}if(t&2){let e=s(8);d(e.cx("chipIcon")),r("pBind",e.ptm("chipIcon")),f("aria-hidden",!0),c(),r("ngTemplateOutlet",e.chipIconTemplate||e._chipIconTemplate||e.removeTokenIconTemplate||e._removeTokenIconTemplate)("ngTemplateOutletContext",De(6,ji))}}function Xi(t,a){if(t&1&&(C(0),p(1,Ji,2,7,"span",26),T()),t&2){let e=s(7);c(),r("ngIf",e.chipIconTemplate||e._chipIconTemplate||e.removeTokenIconTemplate||e._removeTokenIconTemplate)}}function en(t,a){if(t&1&&p(0,Xi,2,1,"ng-container",20),t&2){let e=s(6);r("ngIf",!e.$disabled()&&!e.readonly)}}function tn(t,a){t&1&&(C(0),p(1,en,1,1,"ng-template",null,5,F),T())}function nn(t,a){if(t&1){let e=O();m(0,"div",19,4)(2,"p-chip",25),x("onRemove",function(i){let l=v(e).$implicit,o=s(4);return I(o.removeOption(l,i))}),p(3,tn,3,0,"ng-container",20),_()()}if(t&2){let e=a.$implicit,n=s(4);d(n.cx("chipItem")),r("pBind",n.ptm("chipItem")),c(2),d(n.cx("pcChip")),r("pt",n.ptm("pcChip"))("unstyled",n.unstyled())("label",n.getLabelByValue(e))("removable",!n.$disabled()&&!n.readonly)("removeIcon",n.chipIcon),c(),r("ngIf",n.chipIconTemplate||n._chipIconTemplate||n.removeTokenIconTemplate||n._removeTokenIconTemplate)}}function ln(t,a){if(t&1&&p(0,nn,4,11,"div",24),t&2){let e=s(3);r("ngForOf",e.chipSelectedItems())}}function on(t,a){if(t&1&&(C(0),B(1),T()),t&2){let e=s(3);c(),R(e.placeholder()||"empty")}}function an(t,a){if(t&1&&(C(0),ne(1,Zi,1,1)(2,ln,1,1,"div",23),p(3,on,2,1,"ng-container",20),T()),t&2){let e=s(2);c(),le(e.chipSelectedItems()&&e.chipSelectedItems().length===e.maxSelectedLabels?1:2),c(2),r("ngIf",!e.modelValue()||e.modelValue().length===0)}}function rn(t,a){if(t&1&&(C(0),p(1,Wi,2,1,"ng-container",20)(2,an,4,2,"ng-container",20),T()),t&2){let e=s();c(),r("ngIf",e.display==="comma"),c(),r("ngIf",e.display==="chip")}}function sn(t,a){t&1&&w(0)}function cn(t,a){if(t&1&&(C(0),B(1),T()),t&2){let e=s(2);c(),R(e.placeholder()||"empty")}}function pn(t,a){if(t&1&&(C(0),p(1,sn,1,0,"ng-container",28)(2,cn,2,1,"ng-container",20),T()),t&2){let e=s();c(),r("ngTemplateOutlet",e.selectedItemsTemplate||e._selectedItemsTemplate)("ngTemplateOutletContext",de(3,qi,e.selectedOptions,e.removeOption.bind(e))),c(),r("ngIf",!e.modelValue()||e.modelValue().length===0)}}function dn(t,a){if(t&1){let e=O();A(),m(0,"svg",31),x("click",function(i){v(e);let l=s(2);return I(l.clear(i))}),_()}if(t&2){let e=s(2);d(e.cx("clearIcon")),r("pBind",e.ptm("clearIcon")),f("aria-hidden",!0)}}function un(t,a){}function mn(t,a){t&1&&p(0,un,0,0,"ng-template")}function _n(t,a){if(t&1){let e=O();m(0,"span",27),x("click",function(i){v(e);let l=s(2);return I(l.clear(i))}),p(1,mn,1,0,null,32),_()}if(t&2){let e=s(2);d(e.cx("clearIcon")),r("pBind",e.ptm("clearIcon")),f("aria-hidden",!0),c(),r("ngTemplateOutlet",e.clearIconTemplate||e._clearIconTemplate)}}function hn(t,a){if(t&1&&(C(0),p(1,dn,1,4,"svg",29)(2,_n,2,5,"span",30),T()),t&2){let e=s();c(),r("ngIf",!e.clearIconTemplate&&!e._clearIconTemplate),c(),r("ngIf",e.clearIconTemplate||e._clearIconTemplate)}}function gn(t,a){t&1&&w(0)}function fn(t,a){if(t&1&&(C(0),p(1,gn,1,0,"ng-container",32),T()),t&2){let e=s(2);c(),r("ngTemplateOutlet",e.loadingIconTemplate||e._loadingIconTemplate)}}function bn(t,a){if(t&1&&z(0,"span",19),t&2){let e=s(3);d(e.cn(e.cx("loadingIcon"),"pi-spin "+e.loadingIcon)),r("pBind",e.ptm("loadingIcon")),f("aria-hidden",!0)}}function yn(t,a){if(t&1&&z(0,"span",19),t&2){let e=s(3);d(e.cn(e.cx("loadingIcon"),"pi pi-spinner pi-spin")),r("pBind",e.ptm("loadingIcon")),f("aria-hidden",!0)}}function vn(t,a){if(t&1&&(C(0),p(1,bn,1,4,"span",33)(2,yn,1,4,"span",33),T()),t&2){let e=s(2);c(),r("ngIf",e.loadingIcon),c(),r("ngIf",!e.loadingIcon)}}function In(t,a){if(t&1&&(C(0),p(1,fn,2,1,"ng-container",20)(2,vn,3,2,"ng-container",20),T()),t&2){let e=s();c(),r("ngIf",e.loadingIconTemplate||e._loadingIconTemplate),c(),r("ngIf",!e.loadingIconTemplate&&!e._loadingIconTemplate)}}function xn(t,a){if(t&1&&z(0,"span",36),t&2){let e=s(3);d(e.cx("dropdownIcon")),r("pBind",e.ptm("dropdownIcon"))("ngClass",e.dropdownIcon),f("aria-hidden",!0)("data-p",e.dropdownIconDataP)}}function Cn(t,a){if(t&1&&(A(),z(0,"svg",37)),t&2){let e=s(3);d(e.cx("dropdownIcon")),r("pBind",e.ptm("dropdownIcon")),f("aria-hidden",!0)("data-p",e.dropdownIconDataP)}}function Tn(t,a){if(t&1&&(C(0),p(1,xn,1,6,"span",34)(2,Cn,1,5,"svg",35),T()),t&2){let e=s(2);c(),r("ngIf",e.dropdownIcon),c(),r("ngIf",!e.dropdownIcon)}}function Sn(t,a){}function wn(t,a){t&1&&p(0,Sn,0,0,"ng-template")}function On(t,a){if(t&1&&(m(0,"span",19),p(1,wn,1,0,null,28),_()),t&2){let e=s(2);d(e.cx("dropdownIcon")),r("pBind",e.ptm("dropdownIcon")),f("aria-hidden",!0),c(),r("ngTemplateOutlet",e.dropdownIconTemplate||e._dropdownIconTemplate)("ngTemplateOutletContext",E(6,Gi,e.dropdownIconDataP))}}function kn(t,a){if(t&1&&p(0,Tn,3,2,"ng-container",20)(1,On,2,8,"span",33),t&2){let e=s();r("ngIf",!e.dropdownIconTemplate&&!e._dropdownIconTemplate),c(),r("ngIf",e.dropdownIconTemplate||e._dropdownIconTemplate)}}function Mn(t,a){t&1&&w(0)}function Vn(t,a){t&1&&w(0)}function En(t,a){if(t&1&&(C(0),p(1,Vn,1,0,"ng-container",28),T()),t&2){let e=s(3);c(),r("ngTemplateOutlet",e.filterTemplate||e._filterTemplate)("ngTemplateOutletContext",E(2,Ht,e.filterOptions))}}function Fn(t,a){if(t&1&&(A(),z(0,"svg",45)),t&2){let e=s().class,n=s(5);d(e),r("pBind",n.getHeaderCheckboxPTOptions("pcHeaderCheckbox.icon"))}}function Ln(t,a){}function Bn(t,a){t&1&&p(0,Ln,0,0,"ng-template")}function An(t,a){if(t&1&&p(0,Fn,1,3,"svg",44)(1,Bn,1,0,null,28),t&2){let e=a.class,n=s(5);r("ngIf",!n.headerCheckboxIconTemplate&&!n._headerCheckboxIconTemplate&&n.allSelected()),c(),r("ngTemplateOutlet",n.headerCheckboxIconTemplate||n._headerCheckboxIconTemplate)("ngTemplateOutletContext",Je(3,Qi,n.allSelected(),n.partialSelected(),e))}}function Dn(t,a){if(t&1){let e=O();m(0,"p-checkbox",43,10),x("onChange",function(i){v(e);let l=s(4);return I(l.onToggleAll(i))}),p(2,An,2,7,"ng-template",null,11,F),_()}if(t&2){let e=s(4);r("pt",e.getHeaderCheckboxPTOptions("pcHeaderCheckbox"))("ngModel",e.allSelected())("ariaLabel",e.toggleAllAriaLabel)("binary",!0)("variant",e.$variant())("disabled",e.$disabled())("unstyled",e.unstyled())}}function Pn(t,a){if(t&1&&(A(),z(0,"svg",50)),t&2){let e=s(5);r("pBind",e.ptm("filterIcon"))}}function zn(t,a){}function Hn(t,a){t&1&&p(0,zn,0,0,"ng-template")}function Nn(t,a){if(t&1&&(m(0,"span",51),p(1,Hn,1,0,null,32),_()),t&2){let e=s(5);r("pBind",e.ptm("filterIcon")),c(),r("ngTemplateOutlet",e.filterIconTemplate||e._filterIconTemplate)}}function Rn(t,a){if(t&1){let e=O();m(0,"p-iconfield",46)(1,"input",47,12),x("input",function(i){v(e);let l=s(4);return I(l.onFilterInputChange(i))})("keydown",function(i){v(e);let l=s(4);return I(l.onFilterKeyDown(i))})("click",function(i){v(e);let l=s(4);return I(l.onInputClick(i))})("blur",function(i){v(e);let l=s(4);return I(l.onFilterBlur(i))}),_(),m(3,"p-inputicon",46),p(4,Pn,1,1,"svg",48)(5,Nn,2,2,"span",49),_()()}if(t&2){let e=s(4);d(e.cx("pcFilterContainer")),r("pt",e.ptm("pcFilterContainer"))("unstyled",e.unstyled()),c(),d(e.cx("pcFilter")),r("pt",e.ptm("pcFilter"))("variant",e.$variant())("value",e._filterValue()||"")("unstyled",e.unstyled()),f("autocomplete",e.autocomplete)("aria-owns",e.id+"_list")("aria-activedescendant",e.focusedOptionId)("disabled",e.$disabled()?"":void 0)("placeholder",e.filterPlaceHolder)("aria-label",e.ariaFilterLabel),c(2),r("pt",e.ptm("pcFilterIconContainer"))("unstyled",e.unstyled()),c(),r("ngIf",!e.filterIconTemplate&&!e._filterIconTemplate),c(),r("ngIf",e.filterIconTemplate||e._filterIconTemplate)}}function $n(t,a){if(t&1&&p(0,Dn,4,7,"p-checkbox",41)(1,Rn,6,20,"p-iconfield",42),t&2){let e=s(3);r("ngIf",e.showToggleAll&&!e.selectionLimit),c(),r("ngIf",e.filter)}}function Kn(t,a){if(t&1&&(m(0,"div",19),pe(1),p(2,En,2,4,"ng-container",21)(3,$n,2,2,"ng-template",null,9,F),_()),t&2){let e=q(4),n=s(2);d(n.cx("header")),r("pBind",n.ptm("header")),c(2),r("ngIf",n.filterTemplate||n._filterTemplate)("ngIfElse",e)}}function jn(t,a){t&1&&w(0)}function qn(t,a){if(t&1&&p(0,jn,1,0,"ng-container",28),t&2){let e=a.$implicit,n=a.options;s(2);let i=q(9);r("ngTemplateOutlet",i)("ngTemplateOutletContext",de(2,Nt,e,n))}}function Gn(t,a){t&1&&w(0)}function Qn(t,a){if(t&1&&p(0,Gn,1,0,"ng-container",28),t&2){let e=a.options,n=s(4);r("ngTemplateOutlet",n.loaderTemplate||n._loaderTemplate)("ngTemplateOutletContext",E(2,Ht,e))}}function Un(t,a){t&1&&(C(0),p(1,Qn,1,4,"ng-template",null,14,F),T())}function Wn(t,a){if(t&1){let e=O();m(0,"p-scroller",52,13),x("onLazyLoad",function(i){v(e);let l=s(2);return I(l.onLazyLoad.emit(i))}),p(2,qn,1,5,"ng-template",null,3,F)(4,Un,3,0,"ng-container",20),_()}if(t&2){let e=s(2);N(E(9,Ee,e.scrollHeight)),r("items",e.visibleOptions())("itemSize",e.virtualScrollItemSize)("autoSize",!0)("tabindex",-1)("lazy",e.lazy)("options",e.virtualScrollOptions),c(4),r("ngIf",e.loaderTemplate||e._loaderTemplate)}}function Zn(t,a){t&1&&w(0)}function Yn(t,a){if(t&1&&(C(0),p(1,Zn,1,0,"ng-container",28),T()),t&2){s();let e=q(9),n=s();c(),r("ngTemplateOutlet",e)("ngTemplateOutletContext",de(3,Nt,n.visibleOptions(),De(2,Ui)))}}function Jn(t,a){if(t&1&&(m(0,"span"),B(1),_()),t&2){let e=s(2).$implicit,n=s(3);c(),R(n.getOptionGroupLabel(e.optionGroup))}}function Xn(t,a){if(t&1&&w(0,58),t&2){let e=s(2).$implicit,n=s(3);r("ngTemplateOutlet",n.groupTemplate)("ngTemplateOutletContext",E(2,zt,e.optionGroup))}}function el(t,a){if(t&1&&(C(0),m(1,"li",56),p(2,Jn,2,1,"span",20)(3,Xn,1,4,"ng-container",57),_(),T()),t&2){let e=s(),n=e.$implicit,i=e.index,l=s().options,o=s(2);c(),d(o.cx("optionGroup")),r("pBind",o.ptm("optionGroup"))("ngStyle",E(7,Ee,l.itemSize+"px")),f("id",o.id+"_"+o.getOptionIndex(i,l)),c(),r("ngIf",!o.groupTemplate&&n.optionGroup),c(),r("ngIf",n.optionGroup&&o.groupTemplate)}}function tl(t,a){if(t&1){let e=O();C(0),m(1,"li",59),x("onClick",function(i){v(e);let l=s().index,o=s().options,u=s(2);return I(u.onOptionSelect(i,!1,u.getOptionIndex(l,o)))})("onMouseEnter",function(i){v(e);let l=s().index,o=s().options,u=s(2);return I(u.onOptionMouseEnter(i,u.getOptionIndex(l,o)))}),_(),T()}if(t&2){let e=s(),n=e.$implicit,i=e.index,l=s().options,o=s(2);c(),r("pBind",o.getPTOptions(n,o.getItemOptions,i,"option"))("id",o.id+"_"+o.getOptionIndex(i,l))("option",n)("selected",o.isSelected(n))("label",o.getOptionLabel(n))("disabled",o.isOptionDisabled(n))("template",o.itemTemplate||o._itemTemplate)("itemCheckboxIconTemplate",o.itemCheckboxIconTemplate||o._itemCheckboxIconTemplate)("itemSize",l.itemSize)("focused",o.focusedOptionIndex()===o.getOptionIndex(i,l))("ariaPosInset",o.getAriaPosInset(o.getOptionIndex(i,l)))("ariaSetSize",o.ariaSetSize)("variant",o.$variant())("highlightOnSelect",o.highlightOnSelect)("pt",o.pt)("unstyled",o.unstyled())}}function il(t,a){if(t&1&&p(0,el,4,9,"ng-container",20)(1,tl,2,16,"ng-container",20),t&2){let e=a.$implicit,n=s(3);r("ngIf",n.isOptionGroup(e)),c(),r("ngIf",!n.isOptionGroup(e))}}function nl(t,a){if(t&1&&B(0),t&2){let e=s(4);ve(" ",e.emptyFilterMessageLabel," ")}}function ll(t,a){t&1&&w(0)}function ol(t,a){if(t&1&&p(0,ll,1,0,"ng-container",32),t&2){let e=s(4);r("ngTemplateOutlet",e.emptyFilterTemplate||e._emptyFilterTemplate||e.emptyTemplate||e._emptyFilterTemplate)}}function al(t,a){if(t&1&&(m(0,"li",56),ne(1,nl,1,1)(2,ol,1,1,"ng-container"),_()),t&2){let e=s().options,n=s(2);d(n.cx("emptyMessage")),r("pBind",n.ptm("emptyMessage"))("ngStyle",E(5,Ee,e.itemSize+"px")),c(),le(!n.emptyFilterTemplate&&!n._emptyFilterTemplate&&!n.emptyTemplate&&!n._emptyTemplate?1:2)}}function rl(t,a){if(t&1&&B(0),t&2){let e=s(4);ve(" ",e.emptyMessageLabel," ")}}function sl(t,a){t&1&&w(0)}function cl(t,a){if(t&1&&p(0,sl,1,0,"ng-container",32),t&2){let e=s(4);r("ngTemplateOutlet",e.emptyTemplate||e._emptyTemplate)}}function pl(t,a){if(t&1&&(m(0,"li",56),ne(1,rl,1,1)(2,cl,1,1,"ng-container"),_()),t&2){let e=s().options,n=s(2);d(n.cx("emptyMessage")),r("pBind",n.ptm("emptyMessage"))("ngStyle",E(5,Ee,e.itemSize+"px")),c(),le(!n.emptyTemplate&&!n._emptyTemplate?1:2)}}function dl(t,a){if(t&1&&(m(0,"ul",53,15),p(2,il,2,2,"ng-template",54)(3,al,3,7,"li",55)(4,pl,3,7,"li",55),_()),t&2){let e=a.$implicit,n=a.options,i=s(2);N(n.contentStyle),d(i.cn(i.cx("list"),n.contentStyleClass)),r("pBind",i.ptm("list")),f("aria-label",i.listLabel),c(2),r("ngForOf",e),c(),r("ngIf",i.hasFilter()&&i.isEmpty()),c(),r("ngIf",!i.hasFilter()&&i.isEmpty())}}function ul(t,a){t&1&&w(0)}function ml(t,a){if(t&1&&(m(0,"div"),pe(1,1),p(2,ul,1,0,"ng-container",32),_()),t&2){let e=s(2);c(2),r("ngTemplateOutlet",e.footerTemplate||e._footerTemplate)}}function _l(t,a){if(t&1){let e=O();m(0,"div",38)(1,"span",39,6),x("focus",function(i){v(e);let l=s();return I(l.onFirstHiddenFocus(i))}),_(),p(3,Mn,1,0,"ng-container",32)(4,Kn,5,5,"div",33),m(5,"div",19),p(6,Wn,5,11,"p-scroller",40)(7,Yn,2,6,"ng-container",20)(8,dl,5,9,"ng-template",null,7,F),_(),p(10,ml,3,1,"div",20),m(11,"span",39,8),x("focus",function(i){v(e);let l=s();return I(l.onLastHiddenFocus(i))}),_()()}if(t&2){let e=s();d(e.cn(e.cx("overlay"),e.panelStyleClass)),r("pBind",e.ptm("overlay"))("ngStyle",e.panelStyle),f("data-p",e.overlayDataP)("id",e.id+"_list"),c(),r("pBind",e.ptm("firstHiddenFocusableEl")),f("tabindex",0)("data-p-hidden-accessible",!0)("data-p-hidden-focusable",!0),c(2),r("ngTemplateOutlet",e.headerTemplate||e._headerTemplate),c(),r("ngIf",e.showHeader),c(),d(e.cx("listContainer")),Ae("max-height",e.virtualScroll?"auto":e.scrollHeight||"auto"),r("pBind",e.ptm("listContainer")),c(),r("ngIf",e.virtualScroll),c(),r("ngIf",!e.virtualScroll),c(3),r("ngIf",e.footerFacet||e.footerTemplate||e._footerTemplate),c(),r("pBind",e.ptm("lastHiddenFocusableEl")),f("tabindex",0)("data-p-hidden-accessible",!0)("data-p-hidden-focusable",!0)}}var hl=`
    ${Dt}

    /* For PrimeNG */
   .p-multiselect.ng-invalid.ng-dirty {
        border-color: dt('multiselect.invalid.border.color');
    }
    p-multiSelect.ng-invalid.ng-dirty .p-multiselect-label.p-placeholder,
    p-multi-select.ng-invalid.ng-dirty .p-multiselect-label.p-placeholder,
    p-multiselect.ng-invalid.ng-dirty .p-multiselect-label.p-placeholder {
        color: dt('multiselect.invalid.placeholder.color');
    }
`,gl={root:({instance:t})=>({position:t.$appendTo()==="self"?"relative":void 0})},fl={root:({instance:t})=>["p-multiselect p-component p-inputwrapper",{"p-multiselect p-component p-inputwrapper":!0,"p-multiselect-display-chip":t.display==="chip","p-disabled":t.$disabled(),"p-invalid":t.invalid(),"p-variant-filled":t.$variant()==="filled","p-focus":t.focused,"p-inputwrapper-filled":t.$filled(),"p-inputwrapper-focus":t.focused||t.overlayVisible,"p-multiselect-open":t.overlayVisible,"p-multiselect-fluid":t.hasFluid,"p-multiselect-sm p-inputfield-sm":t.size()==="small","p-multiselect-lg p-inputfield-lg":t.size()==="large"}],labelContainer:"p-multiselect-label-container",label:({instance:t})=>({"p-multiselect-label":!0,"p-placeholder":t.label()===t.placeholder(),"p-multiselect-label-empty":!t.placeholder()&&!t.defaultLabel&&(!t.modelValue()||t.modelValue().length===0)}),chipItem:"p-multiselect-chip-item",pcChip:"p-multiselect-chip",chipIcon:"p-multiselect-chip-icon",dropdown:"p-multiselect-dropdown",loadingIcon:"p-multiselect-loading-icon",dropdownIcon:"p-multiselect-dropdown-icon",overlay:"p-multiselect-overlay p-component-overlay p-component",header:"p-multiselect-header",pcFilterContainer:"p-multiselect-filter-container",pcFilter:"p-multiselect-filter",listContainer:"p-multiselect-list-container",list:"p-multiselect-list",optionGroup:"p-multiselect-option-group",option:({instance:t})=>({"p-multiselect-option":!0,"p-multiselect-option-selected":t.selected&&t.highlightOnSelect,"p-disabled":t.disabled,"p-focus":t.focused}),emptyMessage:"p-multiselect-empty-message",clearIcon:"p-multiselect-clear-icon"},Ve=(()=>{class t extends se{name="multiselect";style=hl;classes=fl;inlineStyles=gl;static \u0275fac=(()=>{let e;return function(i){return(e||(e=L(t)))(i||t)}})();static \u0275prov=H({token:t,factory:t.\u0275fac})}return t})();var Pt=new K("MULTISELECT_INSTANCE"),bl=new K("MULTISELECT_ITEM_INSTANCE"),yl={provide:Te,useExisting:ge(()=>Rt),multi:!0},vl=(()=>{class t extends Se{$pcMultiSelectItem=k(bl,{optional:!0,skipSelf:!0})??void 0;hostName="MultiSelect";getPTOptions(e){return this.ptm(e,{context:{selected:this.selected,focused:this.focused,disabled:this.disabled}})}option;selected;label;disabled;itemSize;focused;ariaPosInset;ariaSetSize;variant;template;checkIconTemplate;itemCheckboxIconTemplate;highlightOnSelect;onClick=new S;onMouseEnter=new S;_componentStyle=k(Ve);onOptionClick(e){this.onClick.emit({originalEvent:e,option:this.option,selected:this.selected}),e.stopPropagation(),e.preventDefault()}onOptionMouseEnter(e){this.onMouseEnter.emit({originalEvent:e,option:this.option,selected:this.selected})}static \u0275fac=(()=>{let e;return function(i){return(e||(e=L(t)))(i||t)}})();static \u0275cmp=D({type:t,selectors:[["li","pMultiSelectItem",""]],hostAttrs:["role","option"],hostVars:13,hostBindings:function(n,i){n&1&&x("click",function(o){return i.onOptionClick(o)})("mouseenter",function(o){return i.onOptionMouseEnter(o)}),n&2&&(f("aria-label",i.label)("aria-setsize",i.ariaSetSize)("aria-posinset",i.ariaPosInset)("aria-selected",i.selected)("data-p-selected",i.selected)("data-p-focused",i.focused)("data-p-highlight",i.selected)("data-p-disabled",i.disabled)("aria-checked",i.selected),d(i.cx("option")),Ae("height",i.itemSize,"px"))},inputs:{option:"option",selected:[2,"selected","selected",b],label:"label",disabled:[2,"disabled","disabled",b],itemSize:[2,"itemSize","itemSize",Q],focused:[2,"focused","focused",b],ariaPosInset:"ariaPosInset",ariaSetSize:"ariaSetSize",variant:"variant",template:"template",checkIconTemplate:"checkIconTemplate",itemCheckboxIconTemplate:"itemCheckboxIconTemplate",highlightOnSelect:[2,"highlightOnSelect","highlightOnSelect",b]},outputs:{onClick:"onClick",onMouseEnter:"onMouseEnter"},features:[G([Ve]),P],attrs:ci,decls:4,vars:13,consts:[["icon",""],[3,"ngModel","binary","tabindex","variant","ariaLabel","pt","unstyled"],[4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"]],template:function(n,i){n&1&&(m(0,"p-checkbox",1),p(1,_i,3,0,"ng-container",2),_(),p(2,hi,2,1,"span",2)(3,gi,1,0,"ng-container",3)),n&2&&(r("ngModel",i.selected)("binary",!0)("tabindex",-1)("variant",i.variant)("ariaLabel",i.label)("pt",i.getPTOptions("pcOptionCheckbox"))("unstyled",i.unstyled()),c(),r("ngIf",i.itemCheckboxIconTemplate),c(),r("ngIf",!i.template),c(),r("ngTemplateOutlet",i.template)("ngTemplateOutletContext",E(11,zt,i.option)))},dependencies:[W,ue,U,Ne,He,Pe,ze,V],encapsulation:2})}return t})(),Rt=(()=>{class t extends ke{zone;filterService;overlayService;componentName="MultiSelect";id;ariaLabel;styleClass;panelStyle;panelStyleClass;inputId;readonly;group;filter=!0;filterPlaceHolder;filterLocale;overlayVisible=!1;tabindex=0;dataKey;ariaLabelledBy;set displaySelectedLabel(e){this._displaySelectedLabel=e}get displaySelectedLabel(){return this._displaySelectedLabel}set maxSelectedLabels(e){this._maxSelectedLabels=e}get maxSelectedLabels(){return this._maxSelectedLabels}selectionLimit;selectedItemsLabel;showToggleAll=!0;emptyFilterMessage="";emptyMessage="";resetFilterOnHide=!1;dropdownIcon;chipIcon;optionLabel;optionValue;optionDisabled;optionGroupLabel="label";optionGroupChildren="items";showHeader=!0;filterBy;scrollHeight="200px";lazy=!1;virtualScroll;loading=!1;virtualScrollItemSize;loadingIcon;virtualScrollOptions;overlayOptions;ariaFilterLabel;filterMatchMode="contains";tooltip="";tooltipPosition="right";tooltipPositionStyle="absolute";tooltipStyleClass;autofocusFilter=!1;display="comma";autocomplete="off";showClear=!1;autofocus;set placeholder(e){this._placeholder.set(e)}get placeholder(){return this._placeholder.asReadonly()}get options(){return this._options()}set options(e){nt(this._options(),e)||this._options.set(e||[])}get filterValue(){return this._filterValue()}set filterValue(e){this._filterValue.set(e)}get selectAll(){return this._selectAll}set selectAll(e){this._selectAll=e}focusOnHover=!0;filterFields;selectOnFocus=!1;autoOptionFocus=!1;highlightOnSelect=!0;size=$();variant=$();fluid=$(void 0,{transform:b});appendTo=$(void 0);motionOptions=$(void 0);onChange=new S;onFilter=new S;onFocus=new S;onBlur=new S;onClick=new S;onClear=new S;onPanelShow=new S;onPanelHide=new S;onLazyLoad=new S;onRemove=new S;onSelectAllChange=new S;overlayViewChild;filterInputChild;focusInputViewChild;itemsViewChild;scroller;lastHiddenFocusableElementOnOverlay;firstHiddenFocusableElementOnOverlay;headerCheckboxViewChild;footerFacet;headerFacet;_componentStyle=k(Ve);bindDirectiveInstance=k(M,{self:!0});searchValue;searchTimeout;_selectAll=null;_placeholder=j(void 0);_disableTooltip=!1;value;_filteredOptions;focus;filtered;itemTemplate;groupTemplate;loaderTemplate;headerTemplate;filterTemplate;footerTemplate;emptyFilterTemplate;emptyTemplate;selectedItemsTemplate;loadingIconTemplate;filterIconTemplate;removeTokenIconTemplate;chipIconTemplate;clearIconTemplate;dropdownIconTemplate;itemCheckboxIconTemplate;headerCheckboxIconTemplate;templates;_itemTemplate;_groupTemplate;_loaderTemplate;_headerTemplate;_filterTemplate;_footerTemplate;_emptyFilterTemplate;_emptyTemplate;_selectedItemsTemplate;_loadingIconTemplate;_filterIconTemplate;_removeTokenIconTemplate;_chipIconTemplate;_clearIconTemplate;_dropdownIconTemplate;_itemCheckboxIconTemplate;_headerCheckboxIconTemplate;$variant=ae(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());$appendTo=ae(()=>this.appendTo()||this.config.overlayAppendTo());$pcMultiSelect=k(Pt,{optional:!0,skipSelf:!0})??void 0;pcFluid=k(ht,{optional:!0,host:!0,skipSelf:!0});get hasFluid(){return this.fluid()??!!this.pcFluid}onAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case"item":this._itemTemplate=e.template;break;case"group":this._groupTemplate=e.template;break;case"selectedItems":case"selecteditems":this._selectedItemsTemplate=e.template;break;case"header":this._headerTemplate=e.template;break;case"filter":this._filterTemplate=e.template;break;case"emptyfilter":this._emptyFilterTemplate=e.template;break;case"empty":this._emptyTemplate=e.template;break;case"footer":this._footerTemplate=e.template;break;case"loader":this._loaderTemplate=e.template;break;case"headercheckboxicon":this._headerCheckboxIconTemplate=e.template;break;case"loadingicon":this._loadingIconTemplate=e.template;break;case"filtericon":this._filterIconTemplate=e.template;break;case"removetokenicon":this._removeTokenIconTemplate=e.template;break;case"clearicon":this._clearIconTemplate=e.template;break;case"dropdownicon":this._dropdownIconTemplate=e.template;break;case"itemcheckboxicon":this._itemCheckboxIconTemplate=e.template;break;case"chipicon":this._chipIconTemplate=e.template;break;default:this._itemTemplate=e.template;break}})}headerCheckboxFocus;filterOptions;preventModelTouched;focused=!1;itemsWrapper;_displaySelectedLabel=!0;_maxSelectedLabels=3;modelValue=j(null);_filterValue=j(null);_options=j([]);startRangeIndex=j(-1);focusedOptionIndex=j(-1);selectedOptions;clickInProgress=!1;get emptyMessageLabel(){return this.emptyMessage||this.config.getTranslation(X.EMPTY_MESSAGE)}get emptyFilterMessageLabel(){return this.emptyFilterMessage||this.config.getTranslation(X.EMPTY_FILTER_MESSAGE)}get isVisibleClearIcon(){return this.modelValue()!=null&&this.modelValue()!==""&&Z(this.modelValue())&&this.showClear&&!this.$disabled()&&!this.readonly&&this.$filled()}get toggleAllAriaLabel(){return this.config.translation.aria?this.config.translation.aria[this.allSelected()?"selectAll":"unselectAll"]:void 0}get listLabel(){return this.config.getTranslation(X.ARIA).listLabel}getAllVisibleAndNonVisibleOptions(){return this.group?this.flatOptions(this.options):this.options||[]}visibleOptions=ae(()=>{let e=this.getAllVisibleAndNonVisibleOptions(),n=lt(e)&&Tt.isObject(e[0]);if(this._filterValue()){let i;if(n?i=this.filterService.filter(e,this.searchFields(),this._filterValue(),this.filterMatchMode,this.filterLocale):i=e.filter(l=>l.toString().toLocaleLowerCase().includes(this._filterValue().toLocaleLowerCase())),this.group){let l=this.options||[],o=[];return l.forEach(u=>{let he=this.getOptionGroupChildren(u).filter(Gt=>i.includes(Gt));he.length>0&&o.push(Ke($e({},u),{[typeof this.optionGroupChildren=="string"?this.optionGroupChildren:"items"]:[...he]}))}),this.flatOptions(o)}return i}return e});label=ae(()=>{let e,n=this.modelValue();if(n&&n?.length&&this.displaySelectedLabel){if(Z(this.maxSelectedLabels)&&n?.length>(this.maxSelectedLabels||0))return this.getSelectedItemsLabel();e="";for(let i=0;i<n.length;i++)i!==0&&(e+=", "),e+=this.getLabelByValue(n[i])}else e=this.placeholder()||"";return e});chipSelectedItems=ae(()=>Z(this.maxSelectedLabels)&&this.modelValue()&&this.modelValue()?.length>(this.maxSelectedLabels||0)?this.modelValue()?.slice(0,this.maxSelectedLabels):this.modelValue());constructor(e,n,i){super(),this.zone=e,this.filterService=n,this.overlayService=i,Ge(()=>{let l=this.modelValue(),o=this.getAllVisibleAndNonVisibleOptions();o&&Z(o)&&(this.optionValue&&this.optionLabel&&l?this.selectedOptions=o.filter(u=>l.includes(u[this.optionLabel])||l.includes(u[this.optionValue])):this.selectedOptions=l,this.cd.markForCheck())})}onInit(){this.id=this.id||Ce("pn_id_"),this.autoUpdateModel(),this.filterBy&&(this.filterOptions={filter:e=>this.onFilterInputChange(e),reset:()=>this.resetFilter()})}maxSelectionLimitReached(){return this.selectionLimit&&this.modelValue()&&this.modelValue().length===this.selectionLimit}onAfterViewInit(){this.overlayVisible&&this.show()}onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"])),this.filtered&&(this.zone.runOutsideAngular(()=>{setTimeout(()=>{this.overlayViewChild?.alignOverlay()},1)}),this.filtered=!1)}flatOptions(e){return(e||[]).reduce((n,i,l)=>{n.push({optionGroup:i,group:!0,index:l});let o=this.getOptionGroupChildren(i);return o&&o.forEach(u=>n.push(u)),n},[])}autoUpdateModel(){if(this.selectOnFocus&&this.autoOptionFocus&&!this.hasSelectedOption()){this.focusedOptionIndex.set(this.findFirstFocusedOptionIndex());let e=this.getOptionValue(this.visibleOptions()[this.focusedOptionIndex()]);this.onOptionSelect({originalEvent:null,option:[e]})}}updateModel(e,n){this.value=e,this.onModelChange(e),this.writeValue(e)}onInputClick(e){e.stopPropagation(),e.preventDefault(),this.focusedOptionIndex.set(-1)}onOptionSelect(e,n=!1,i=-1){let{originalEvent:l,option:o}=e;if(this.$disabled()||this.isOptionDisabled(o))return;let u=this.isSelected(o),y=[];u?y=this.modelValue().filter(he=>!me(he,this.getOptionValue(o),this.equalityKey()||"")):y=[...this.modelValue()||[],this.getOptionValue(o)],this.updateModel(y,l),i!==-1&&this.focusedOptionIndex.set(i),n&&J(this.focusInputViewChild?.nativeElement),this.onChange.emit({originalEvent:e,value:y,itemValue:o})}findSelectedOptionIndex(){return this.hasSelectedOption()?this.visibleOptions().findIndex(e=>this.isValidSelectedOption(e)):-1}onOptionSelectRange(e,n=-1,i=-1){if(n===-1&&(n=this.findNearestSelectedOptionIndex(i,!0)),i===-1&&(i=this.findNearestSelectedOptionIndex(n)),n!==-1&&i!==-1){let l=Math.min(n,i),o=Math.max(n,i),u=this.visibleOptions().slice(l,o+1).filter(y=>this.isValidOption(y)).map(y=>this.getOptionValue(y));this.updateModel(u,e)}}searchFields(){return(this.filterBy||this.optionLabel||"label").split(",")}findNearestSelectedOptionIndex(e,n=!1){let i=-1;return this.hasSelectedOption()&&(n?(i=this.findPrevSelectedOptionIndex(e),i=i===-1?this.findNextSelectedOptionIndex(e):i):(i=this.findNextSelectedOptionIndex(e),i=i===-1?this.findPrevSelectedOptionIndex(e):i)),i>-1?i:e}findPrevSelectedOptionIndex(e){let n=this.hasSelectedOption()&&e>0?_e(this.visibleOptions().slice(0,e),i=>this.isValidSelectedOption(i)):-1;return n>-1?n:-1}findFirstFocusedOptionIndex(){let e=this.findFirstSelectedOptionIndex();return e<0?this.findFirstOptionIndex():e}findFirstOptionIndex(){return this.visibleOptions().findIndex(e=>this.isValidOption(e))}findFirstSelectedOptionIndex(){return this.hasSelectedOption()?this.visibleOptions().findIndex(e=>this.isValidSelectedOption(e)):-1}findNextSelectedOptionIndex(e){let n=this.hasSelectedOption()&&e<this.visibleOptions().length-1?this.visibleOptions().slice(e+1).findIndex(i=>this.isValidSelectedOption(i)):-1;return n>-1?n+e+1:-1}equalityKey(){return this.optionValue?null:this.dataKey}hasSelectedOption(){return Z(this.modelValue())}isValidSelectedOption(e){return this.isValidOption(e)&&this.isSelected(e)}isOptionGroup(e){return e&&(this.group||this.optionGroupLabel)&&e.optionGroup&&e.group}isValidOption(e){return e&&!(this.isOptionDisabled(e)||this.isOptionGroup(e))}isOptionDisabled(e){return this.maxSelectionLimitReached()&&!this.isSelected(e)?!0:this.optionDisabled?Y(e,this.optionDisabled):e&&e.disabled!==void 0?e.disabled:!1}isSelected(e){let n=this.getOptionValue(e);return(this.modelValue()||[]).some(i=>me(i,n,this.equalityKey()||""))}isOptionMatched(e){return this.isValidOption(e)&&this.getOptionLabel(e).toString().toLocaleLowerCase(this.filterLocale).startsWith(this.searchValue?.toLocaleLowerCase(this.filterLocale))}isEmpty(){return!this._options()||this.visibleOptions()&&this.visibleOptions().length===0}getOptionIndex(e,n){return this.virtualScrollerDisabled?e:n&&n.getItemOptions(e).index}getAriaPosInset(e){return(this.optionGroupLabel?e-this.visibleOptions().slice(0,e).filter(n=>this.isOptionGroup(n)).length:e)+1}get ariaSetSize(){return this.visibleOptions().filter(e=>!this.isOptionGroup(e)).length}getLabelByValue(e){let i=(this.group?this.flatOptions(this._options()):this._options()||[]).find(l=>!this.isOptionGroup(l)&&me(this.getOptionValue(l),e,this.equalityKey()||""));return i?this.getOptionLabel(i):null}getSelectedItemsLabel(){let e=/{(.*?)}/,n=this.selectedItemsLabel?this.selectedItemsLabel:this.config.getTranslation(X.SELECTION_MESSAGE);return e.test(n)?n.replace(n.match(e)[0],this.modelValue().length+""):n}getOptionLabel(e){return this.optionLabel?Y(e,this.optionLabel):e&&e.label!=null?e.label:e}getOptionValue(e){return this.optionValue?Y(e,this.optionValue):!this.optionLabel&&e&&e.value!==void 0?e.value:e}getOptionGroupLabel(e){return this.optionGroupLabel?Y(e,this.optionGroupLabel):e&&e.label!=null?e.label:e}getOptionGroupChildren(e){return e?this.optionGroupChildren?Y(e,this.optionGroupChildren):e.items:[]}onKeyDown(e){if(this.$disabled()){e.preventDefault();return}let n=e.metaKey||e.ctrlKey;switch(e.code){case"ArrowDown":this.onArrowDownKey(e);break;case"ArrowUp":this.onArrowUpKey(e);break;case"Home":this.onHomeKey(e);break;case"End":this.onEndKey(e);break;case"PageDown":this.onPageDownKey(e);break;case"PageUp":this.onPageUpKey(e);break;case"Enter":case"Space":this.onEnterKey(e);break;case"Escape":this.onEscapeKey(e);break;case"Tab":this.onTabKey(e);break;case"ShiftLeft":case"ShiftRight":this.onShiftKey();break;default:if(e.code==="KeyA"&&n){let i=this.visibleOptions().filter(l=>this.isValidOption(l)).map(l=>this.getOptionValue(l));this.updateModel(i,e),e.preventDefault();break}!n&&ot(e.key)&&(!this.overlayVisible&&this.show(),this.searchOptions(e,e.key),e.preventDefault());break}}onFilterKeyDown(e){switch(e.code){case"ArrowDown":this.onArrowDownKey(e);break;case"ArrowUp":this.onArrowUpKey(e,!0);break;case"ArrowLeft":case"ArrowRight":this.onArrowLeftKey(e,!0);break;case"Home":this.onHomeKey(e,!0);break;case"End":this.onEndKey(e,!0);break;case"Enter":case"NumpadEnter":this.onEnterKey(e);break;case"Escape":this.onEscapeKey(e);break;case"Tab":this.onTabKey(e,!0);break;default:break}}onArrowLeftKey(e,n=!1){n&&this.focusedOptionIndex.set(-1)}onArrowDownKey(e){let n=this.focusedOptionIndex()!==-1?this.findNextOptionIndex(this.focusedOptionIndex()):this.findFirstFocusedOptionIndex();e.shiftKey&&this.onOptionSelectRange(e,this.startRangeIndex(),n),this.changeFocusedOptionIndex(e,n),!this.overlayVisible&&this.show(),e.preventDefault(),e.stopPropagation()}onArrowUpKey(e,n=!1){if(e.altKey&&!n)this.focusedOptionIndex()!==-1&&this.onOptionSelect(e,this.visibleOptions()[this.focusedOptionIndex()]),this.overlayVisible&&this.hide(),e.preventDefault();else{let i=this.focusedOptionIndex()!==-1?this.findPrevOptionIndex(this.focusedOptionIndex()):this.findLastFocusedOptionIndex();e.shiftKey&&this.onOptionSelectRange(e,i,this.startRangeIndex()),this.changeFocusedOptionIndex(e,i),!this.overlayVisible&&this.show(),e.preventDefault()}e.stopPropagation()}onHomeKey(e,n=!1){let{currentTarget:i}=e;if(n){let l=i.value.length;i.setSelectionRange(0,e.shiftKey?l:0),this.focusedOptionIndex.set(-1)}else{let l=e.metaKey||e.ctrlKey,o=this.findFirstOptionIndex();e.shiftKey&&l&&this.onOptionSelectRange(e,o,this.startRangeIndex()),this.changeFocusedOptionIndex(e,o),!this.overlayVisible&&this.show()}e.preventDefault()}onEndKey(e,n=!1){let{currentTarget:i}=e;if(n){let l=i.value.length;i.setSelectionRange(e.shiftKey?0:l,l),this.focusedOptionIndex.set(-1)}else{let l=e.metaKey||e.ctrlKey,o=this.findLastFocusedOptionIndex();e.shiftKey&&l&&this.onOptionSelectRange(e,this.startRangeIndex(),o),this.changeFocusedOptionIndex(e,o),!this.overlayVisible&&this.show()}e.preventDefault()}onPageDownKey(e){this.scrollInView(this.visibleOptions().length-1),e.preventDefault()}onPageUpKey(e){this.scrollInView(0),e.preventDefault()}onEnterKey(e){this.overlayVisible?this.focusedOptionIndex()!==-1&&(e.shiftKey?this.onOptionSelectRange(e,this.focusedOptionIndex()):this.onOptionSelect({originalEvent:e,option:this.visibleOptions()[this.focusedOptionIndex()]})):this.onArrowDownKey(e),e.preventDefault()}onEscapeKey(e){this.overlayVisible&&(this.hide(!0),e.stopPropagation(),e.preventDefault())}onTabKey(e,n=!1){if(!n)if(this.overlayVisible&&this.hasFocusableElements())J(e.shiftKey?this.lastHiddenFocusableElementOnOverlay?.nativeElement:this.firstHiddenFocusableElementOnOverlay?.nativeElement),e.preventDefault();else{if(this.focusedOptionIndex()!==-1){let i=this.visibleOptions()[this.focusedOptionIndex()];!this.isSelected(i)&&this.onOptionSelect({originalEvent:e,option:i})}this.overlayVisible&&this.hide(this.filter)}}onShiftKey(){this.startRangeIndex.set(this.focusedOptionIndex())}onContainerClick(e){if(!(this.$disabled()||this.loading||this.readonly||e.target?.isSameNode?.(this.focusInputViewChild?.nativeElement))){if(!this.overlayViewChild||!this.overlayViewChild.el.nativeElement.contains(e.target)){if(this.clickInProgress)return;this.clickInProgress=!0,setTimeout(()=>{this.clickInProgress=!1},150),this.overlayVisible?this.hide(!0):this.show(!0)}this.focusInputViewChild?.nativeElement.focus({preventScroll:!0}),this.onClick.emit(e),this.cd.detectChanges()}}onFirstHiddenFocus(e){let n=e.relatedTarget===this.focusInputViewChild?.nativeElement?rt(this.overlayViewChild?.overlayViewChild?.nativeElement,':not([data-p-hidden-focusable="true"])'):this.focusInputViewChild?.nativeElement;J(n)}onInputFocus(e){this.focused=!0;let n=this.focusedOptionIndex()!==-1?this.focusedOptionIndex():this.overlayVisible&&this.autoOptionFocus?this.findFirstFocusedOptionIndex():-1;this.focusedOptionIndex.set(n),this.overlayVisible&&this.scrollInView(this.focusedOptionIndex()),this.onFocus.emit({originalEvent:e})}onInputBlur(e){this.focused=!1,this.onBlur.emit({originalEvent:e}),this.preventModelTouched||this.onModelTouched(),this.preventModelTouched=!1}onFilterInputChange(e){let n=e.target.value;this._filterValue.set(n),this.focusedOptionIndex.set(-1),this.onFilter.emit({originalEvent:e,filter:this._filterValue()}),!this.virtualScrollerDisabled&&this.scroller?.scrollToIndex(0),setTimeout(()=>{this.overlayViewChild?.alignOverlay()})}onLastHiddenFocus(e){let n=e.relatedTarget===this.focusInputViewChild?.nativeElement?st(this.overlayViewChild?.overlayViewChild?.nativeElement,':not([data-p-hidden-focusable="true"])'):this.focusInputViewChild?.nativeElement;J(n)}onOptionMouseEnter(e,n){this.focusOnHover&&this.changeFocusedOptionIndex(e,n)}onFilterBlur(e){this.focusedOptionIndex.set(-1)}onToggleAll(e){if(!(this.$disabled()||this.readonly)){if(this.selectAll!=null)this.onSelectAllChange.emit({originalEvent:e,checked:!this.allSelected()});else{let n=this.getAllVisibleAndNonVisibleOptions().filter(y=>this.isSelected(y)&&(this.optionDisabled?Y(y,this.optionDisabled):y&&y.disabled!==void 0?y.disabled:!1)),i=this.allSelected()?this.visibleOptions().filter(y=>!this.isValidOption(y)&&this.isSelected(y)):this.visibleOptions().filter(y=>this.isSelected(y)||this.isValidOption(y)),o=[...this.filter&&!this.allSelected()?this.getAllVisibleAndNonVisibleOptions().filter(y=>this.isSelected(y)&&this.isValidOption(y)):[],...n,...i].map(y=>this.getOptionValue(y)),u=[...new Set(o)];this.updateModel(u,e),(!u.length||u.length===this.getAllVisibleAndNonVisibleOptions().length)&&this.onSelectAllChange.emit({originalEvent:e,checked:!!u.length})}this.partialSelected()&&(this.selectedOptions=[],this.cd.markForCheck()),this.onChange.emit({originalEvent:e,value:this.value}),mt.focus(this.headerCheckboxViewChild?.inputViewChild?.nativeElement),this.headerCheckboxFocus=!0,e.originalEvent.preventDefault(),e.originalEvent.stopPropagation()}}changeFocusedOptionIndex(e,n){this.focusedOptionIndex()!==n&&(this.focusedOptionIndex.set(n),this.scrollInView())}get virtualScrollerDisabled(){return!this.virtualScroll}scrollInView(e=-1){let n=e!==-1?`${this.id}_${e}`:this.focusedOptionId;if(this.itemsViewChild&&this.itemsViewChild.nativeElement){let i=xe(this.itemsViewChild.nativeElement,`li[id="${n}"]`);i?i.scrollIntoView&&i.scrollIntoView({block:"nearest",inline:"nearest"}):this.virtualScrollerDisabled||setTimeout(()=>{this.virtualScroll&&this.scroller?.scrollToIndex(e!==-1?e:this.focusedOptionIndex())},0)}}get focusedOptionId(){return this.focusedOptionIndex()!==-1?`${this.id}_${this.focusedOptionIndex()}`:null}allSelected(){return this.selectAll!==null?this.selectAll:Z(this.visibleOptions())&&this.visibleOptions().every(e=>this.isOptionGroup(e)||this.isOptionDisabled(e)||this.isSelected(e))}partialSelected(){return this.selectedOptions&&this.selectedOptions.length>0&&this.selectedOptions.length<(this.options?.length||0)}show(e){this.overlayVisible=!0;let n=this.focusedOptionIndex()!==-1?this.focusedOptionIndex():this.autoOptionFocus?this.findFirstFocusedOptionIndex():this.findSelectedOptionIndex();this.focusedOptionIndex.set(n),e&&J(this.focusInputViewChild?.nativeElement),this.cd.markForCheck()}hide(e){this.overlayVisible=!1,this.focusedOptionIndex.set(-1),this.filter&&this.resetFilterOnHide&&this.resetFilter(),this.overlayOptions?.mode==="modal"&&_t(),e&&J(this.focusInputViewChild?.nativeElement),this.cd.markForCheck()}onOverlayBeforeEnter(e){if(this.itemsWrapper=xe(this.overlayViewChild?.overlayViewChild?.nativeElement,this.virtualScroll?'[data-pc-name="virtualscroller"]':'[data-pc-section="listcontainer"]'),this.virtualScroll&&this.scroller?.setContentEl(this.itemsViewChild?.nativeElement),this.options&&this.options.length)if(this.virtualScroll){let n=this.modelValue()?this.focusedOptionIndex():-1;n!==-1&&this.scroller?.scrollToIndex(n)}else{let n=xe(this.itemsWrapper,'[data-pc-section="option"][data-p-selected="true"]');n&&n.scrollIntoView({block:"nearest",inline:"nearest"})}this.filterInputChild&&this.filterInputChild.nativeElement&&(this.preventModelTouched=!0,this.autofocusFilter&&this.filterInputChild.nativeElement.focus()),this.onPanelShow.emit(e)}onOverlayAfterLeave(e){this.itemsWrapper=null,this.onModelTouched(),this.onPanelHide.emit(e)}resetFilter(){this.filterInputChild&&this.filterInputChild.nativeElement&&(this.filterInputChild.nativeElement.value=""),this._filterValue.set(null),this._filteredOptions=null}onOverlayHide(e){this.focusedOptionIndex.set(-1),this.filter&&this.resetFilterOnHide&&this.resetFilter()}close(e){this.hide(),e.preventDefault(),e.stopPropagation()}clear(e){this.value=[],this.updateModel(null,e),this.selectedOptions=[],this.onClear.emit(),this._disableTooltip=!0,e.stopPropagation()}labelContainerMouseLeave(){this._disableTooltip&&(this._disableTooltip=!1)}removeOption(e,n){let i=this.modelValue().filter(l=>!me(l,e,this.equalityKey()||""));this.updateModel(i,n),this.onChange.emit({originalEvent:n,value:i,itemValue:e}),this.onRemove.emit({newValue:i,removed:e}),n&&n.stopPropagation()}findNextOptionIndex(e){let n=e<this.visibleOptions().length-1?this.visibleOptions().slice(e+1).findIndex(i=>this.isValidOption(i)):-1;return n>-1?n+e+1:e}findPrevOptionIndex(e){let n=e>0?_e(this.visibleOptions().slice(0,e),i=>this.isValidOption(i)):-1;return n>-1?n:e}findLastSelectedOptionIndex(){return this.hasSelectedOption()?_e(this.visibleOptions(),e=>this.isValidSelectedOption(e)):-1}findLastFocusedOptionIndex(){let e=this.findLastSelectedOptionIndex();return e<0?this.findLastOptionIndex():e}findLastOptionIndex(){return _e(this.visibleOptions(),e=>this.isValidOption(e))}searchOptions(e,n){this.searchValue=(this.searchValue||"")+n;let i=-1,l=!1;return this.focusedOptionIndex()!==-1?(i=this.visibleOptions().slice(this.focusedOptionIndex()).findIndex(o=>this.isOptionMatched(o)),i=i===-1?this.visibleOptions().slice(0,this.focusedOptionIndex()).findIndex(o=>this.isOptionMatched(o)):i+this.focusedOptionIndex()):i=this.visibleOptions().findIndex(o=>this.isOptionMatched(o)),i!==-1&&(l=!0),i===-1&&this.focusedOptionIndex()===-1&&(i=this.findFirstFocusedOptionIndex()),i!==-1&&this.changeFocusedOptionIndex(e,i),this.searchTimeout&&clearTimeout(this.searchTimeout),this.searchTimeout=setTimeout(()=>{this.searchValue="",this.searchTimeout=null},500),l}hasFocusableElements(){return at(this.overlayViewChild?.overlayViewChild?.nativeElement,':not([data-p-hidden-focusable="true"])').length>0}hasFilter(){return this._filterValue()&&this._filterValue().trim().length>0}get containerDataP(){return this.cn({invalid:this.invalid(),disabled:this.$disabled(),focus:this.focused,fluid:this.hasFluid,filled:this.$variant()==="filled",[this.size()]:this.size()})}get labelDataP(){return this.cn({placeholder:this.label===this.placeholder,clearable:this.showClear,disabled:this.disabled,[this.size()]:this.size(),"has-chip":this.display==="chip"&&this.value&&this.value.length&&(this.maxSelectedLabels?this.value.length<=this.maxSelectedLabels:!0),empty:!this.placeholder&&!this.$filled})}get dropdownIconDataP(){return this.cn({[this.size()]:this.size()})}get overlayDataP(){return this.cn({["overlay-"+this.appendTo]:"overlay-"+this.appendTo})}writeControlValue(e,n){this.value=e,n(e),this.cd.markForCheck()}getHeaderCheckboxPTOptions(e){return this.ptm(e,{context:{selected:this.allSelected()}})}getPTOptions(e,n,i,l){return this.ptm(l,{context:{selected:this.isSelected(e),focused:this.focusedOptionIndex()===this.getOptionIndex(i,n),disabled:this.isOptionDisabled(e)}})}static \u0275fac=function(n){return new(n||t)(fe(qe),fe(ct),fe(pt))};static \u0275cmp=D({type:t,selectors:[["p-multiSelect"],["p-multiselect"],["p-multi-select"]],contentQueries:function(n,i,l){if(n&1&&oe(l,ut,5)(l,dt,5)(l,fi,4)(l,bi,4)(l,yi,4)(l,vi,4)(l,Ii,4)(l,xi,4)(l,Ci,4)(l,Ti,4)(l,Si,4)(l,wi,4)(l,Oi,4)(l,ki,4)(l,Mi,4)(l,Vi,4)(l,Ei,4)(l,Fi,4)(l,Li,4)(l,re,4),n&2){let o;h(o=g())&&(i.footerFacet=o.first),h(o=g())&&(i.headerFacet=o.first),h(o=g())&&(i.itemTemplate=o.first),h(o=g())&&(i.groupTemplate=o.first),h(o=g())&&(i.loaderTemplate=o.first),h(o=g())&&(i.headerTemplate=o.first),h(o=g())&&(i.filterTemplate=o.first),h(o=g())&&(i.footerTemplate=o.first),h(o=g())&&(i.emptyFilterTemplate=o.first),h(o=g())&&(i.emptyTemplate=o.first),h(o=g())&&(i.selectedItemsTemplate=o.first),h(o=g())&&(i.loadingIconTemplate=o.first),h(o=g())&&(i.filterIconTemplate=o.first),h(o=g())&&(i.removeTokenIconTemplate=o.first),h(o=g())&&(i.chipIconTemplate=o.first),h(o=g())&&(i.clearIconTemplate=o.first),h(o=g())&&(i.dropdownIconTemplate=o.first),h(o=g())&&(i.itemCheckboxIconTemplate=o.first),h(o=g())&&(i.headerCheckboxIconTemplate=o.first),h(o=g())&&(i.templates=o)}},viewQuery:function(n,i){if(n&1&&ye(Bi,5)(Ai,5)(Di,5)(Pi,5)(zi,5)(Hi,5)(Ni,5)(Ri,5),n&2){let l;h(l=g())&&(i.overlayViewChild=l.first),h(l=g())&&(i.filterInputChild=l.first),h(l=g())&&(i.focusInputViewChild=l.first),h(l=g())&&(i.itemsViewChild=l.first),h(l=g())&&(i.scroller=l.first),h(l=g())&&(i.lastHiddenFocusableElementOnOverlay=l.first),h(l=g())&&(i.firstHiddenFocusableElementOnOverlay=l.first),h(l=g())&&(i.headerCheckboxViewChild=l.first)}},hostVars:6,hostBindings:function(n,i){n&1&&x("click",function(o){return i.onContainerClick(o)}),n&2&&(f("id",i.id)("data-p",i.containerDataP),N(i.sx("root")),d(i.cn(i.cx("root"),i.styleClass)))},inputs:{id:"id",ariaLabel:"ariaLabel",styleClass:"styleClass",panelStyle:"panelStyle",panelStyleClass:"panelStyleClass",inputId:"inputId",readonly:[2,"readonly","readonly",b],group:[2,"group","group",b],filter:[2,"filter","filter",b],filterPlaceHolder:"filterPlaceHolder",filterLocale:"filterLocale",overlayVisible:[2,"overlayVisible","overlayVisible",b],tabindex:[2,"tabindex","tabindex",Q],dataKey:"dataKey",ariaLabelledBy:"ariaLabelledBy",displaySelectedLabel:"displaySelectedLabel",maxSelectedLabels:"maxSelectedLabels",selectionLimit:[2,"selectionLimit","selectionLimit",Q],selectedItemsLabel:"selectedItemsLabel",showToggleAll:[2,"showToggleAll","showToggleAll",b],emptyFilterMessage:"emptyFilterMessage",emptyMessage:"emptyMessage",resetFilterOnHide:[2,"resetFilterOnHide","resetFilterOnHide",b],dropdownIcon:"dropdownIcon",chipIcon:"chipIcon",optionLabel:"optionLabel",optionValue:"optionValue",optionDisabled:"optionDisabled",optionGroupLabel:"optionGroupLabel",optionGroupChildren:"optionGroupChildren",showHeader:[2,"showHeader","showHeader",b],filterBy:"filterBy",scrollHeight:"scrollHeight",lazy:[2,"lazy","lazy",b],virtualScroll:[2,"virtualScroll","virtualScroll",b],loading:[2,"loading","loading",b],virtualScrollItemSize:[2,"virtualScrollItemSize","virtualScrollItemSize",Q],loadingIcon:"loadingIcon",virtualScrollOptions:"virtualScrollOptions",overlayOptions:"overlayOptions",ariaFilterLabel:"ariaFilterLabel",filterMatchMode:"filterMatchMode",tooltip:"tooltip",tooltipPosition:"tooltipPosition",tooltipPositionStyle:"tooltipPositionStyle",tooltipStyleClass:"tooltipStyleClass",autofocusFilter:[2,"autofocusFilter","autofocusFilter",b],display:"display",autocomplete:"autocomplete",showClear:[2,"showClear","showClear",b],autofocus:[2,"autofocus","autofocus",b],placeholder:"placeholder",options:"options",filterValue:"filterValue",selectAll:"selectAll",focusOnHover:[2,"focusOnHover","focusOnHover",b],filterFields:"filterFields",selectOnFocus:[2,"selectOnFocus","selectOnFocus",b],autoOptionFocus:[2,"autoOptionFocus","autoOptionFocus",b],highlightOnSelect:[2,"highlightOnSelect","highlightOnSelect",b],size:[1,"size"],variant:[1,"variant"],fluid:[1,"fluid"],appendTo:[1,"appendTo"],motionOptions:[1,"motionOptions"]},outputs:{onChange:"onChange",onFilter:"onFilter",onFocus:"onFocus",onBlur:"onBlur",onClick:"onClick",onClear:"onClear",onPanelShow:"onPanelShow",onPanelHide:"onPanelHide",onLazyLoad:"onLazyLoad",onRemove:"onRemove",onSelectAllChange:"onSelectAllChange"},features:[G([yl,Ve,{provide:Pt,useExisting:t},{provide:ce,useExisting:t}]),ie([M]),P],ngContentSelectors:Ki,decls:16,vars:51,consts:[["focusInput",""],["elseBlock",""],["overlay",""],["content",""],["token",""],["removeicon",""],["firstHiddenFocusableEl",""],["buildInItems",""],["lastHiddenFocusableEl",""],["builtInFilterElement",""],["headerCheckbox",""],["icon",""],["filterInput",""],["scroller",""],["loader",""],["items",""],[1,"p-hidden-accessible",3,"pBind"],["role","combobox",3,"focus","blur","keydown","pTooltip","pTooltipUnstyled","tooltipPosition","positionStyle","tooltipStyleClass","pAutoFocus","pBind"],[3,"mouseleave","pBind","pTooltip","pTooltipUnstyled","tooltipDisabled","tooltipPosition","positionStyle","tooltipStyleClass"],[3,"pBind"],[4,"ngIf"],[4,"ngIf","ngIfElse"],[3,"visibleChange","onBeforeEnter","onAfterLeave","onHide","hostAttrSelector","visible","options","target","appendTo","unstyled","pt","motionOptions"],[3,"pBind","class"],[3,"pBind","class",4,"ngFor","ngForOf"],[3,"onRemove","pt","unstyled","label","removable","removeIcon"],[3,"class","pBind","click",4,"ngIf"],[3,"click","pBind"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],["data-p-icon","times",3,"pBind","class","click",4,"ngIf"],[3,"pBind","class","click",4,"ngIf"],["data-p-icon","times",3,"click","pBind"],[4,"ngTemplateOutlet"],[3,"pBind","class",4,"ngIf"],[3,"pBind","class","ngClass",4,"ngIf"],["data-p-icon","chevron-down",3,"pBind","class",4,"ngIf"],[3,"pBind","ngClass"],["data-p-icon","chevron-down",3,"pBind"],[3,"pBind","ngStyle"],["role","presentation",1,"p-hidden-accessible","p-hidden-focusable",3,"focus","pBind"],[3,"items","style","itemSize","autoSize","tabindex","lazy","options","onLazyLoad",4,"ngIf"],[3,"pt","ngModel","ariaLabel","binary","variant","disabled","unstyled","onChange",4,"ngIf"],[3,"pt","class","unstyled",4,"ngIf"],[3,"onChange","pt","ngModel","ariaLabel","binary","variant","disabled","unstyled"],["data-p-icon","check",3,"class","pBind",4,"ngIf"],["data-p-icon","check",3,"pBind"],[3,"pt","unstyled"],["pInputText","","type","text","role","searchbox",3,"input","keydown","click","blur","pt","variant","value","unstyled"],["data-p-icon","search",3,"pBind",4,"ngIf"],["class","p-multiselect-filter-icon",3,"pBind",4,"ngIf"],["data-p-icon","search",3,"pBind"],[1,"p-multiselect-filter-icon",3,"pBind"],[3,"onLazyLoad","items","itemSize","autoSize","tabindex","lazy","options"],["role","listbox","aria-multiselectable","true",3,"pBind"],["ngFor","",3,"ngForOf"],["role","option",3,"pBind","class","ngStyle",4,"ngIf"],["role","option",3,"pBind","ngStyle"],[3,"ngTemplateOutlet","ngTemplateOutletContext",4,"ngIf"],[3,"ngTemplateOutlet","ngTemplateOutletContext"],["pMultiSelectItem","","pRipple","",3,"onClick","onMouseEnter","pBind","id","option","selected","label","disabled","template","itemCheckboxIconTemplate","itemSize","focused","ariaPosInset","ariaSetSize","variant","highlightOnSelect","pt","unstyled"]],template:function(n,i){if(n&1){let l=O();be($i),m(0,"div",16)(1,"input",17,0),x("focus",function(u){return i.onInputFocus(u)})("blur",function(u){return i.onInputBlur(u)})("keydown",function(u){return i.onKeyDown(u)}),_()(),m(3,"div",18),x("mouseleave",function(){return i.labelContainerMouseLeave()}),m(4,"div",19),p(5,rn,3,2,"ng-container",20)(6,pn,3,6,"ng-container",20),_()(),p(7,hn,3,2,"ng-container",20),m(8,"div",19),p(9,In,3,2,"ng-container",21)(10,kn,2,2,"ng-template",null,1,F),_(),m(12,"p-overlay",22,2),Ye("visibleChange",function(u){return v(l),Ze(i.overlayVisible,u)||(i.overlayVisible=u),I(u)}),x("onBeforeEnter",function(u){return i.onOverlayBeforeEnter(u)})("onAfterLeave",function(u){return i.onOverlayAfterLeave(u)})("onHide",function(u){return i.onOverlayHide(u)}),p(14,_l,13,24,"ng-template",null,3,F),_()}if(n&2){let l=q(11);r("pBind",i.ptm("hiddenInputContainer")),f("data-p-hidden-accessible",!0),c(),r("pTooltip",i.tooltip)("pTooltipUnstyled",i.unstyled())("tooltipPosition",i.tooltipPosition)("positionStyle",i.tooltipPositionStyle)("tooltipStyleClass",i.tooltipStyleClass)("pAutoFocus",i.autofocus)("pBind",i.ptm("hiddenInput")),f("aria-disabled",i.$disabled())("id",i.inputId)("aria-label",i.ariaLabel)("aria-labelledby",i.ariaLabelledBy)("aria-haspopup","listbox")("aria-expanded",i.overlayVisible??!1)("aria-controls",i.overlayVisible?i.id+"_list":null)("tabindex",i.$disabled()?-1:i.tabindex)("aria-activedescendant",i.focused?i.focusedOptionId:void 0)("value",i.modelValue())("name",i.name())("required",i.required()?"":void 0)("disabled",i.$disabled()?"":void 0),c(2),d(i.cx("labelContainer")),r("pBind",i.ptm("labelContainer"))("pTooltip",i.tooltip)("pTooltipUnstyled",i.unstyled())("tooltipDisabled",i._disableTooltip)("tooltipPosition",i.tooltipPosition)("positionStyle",i.tooltipPositionStyle)("tooltipStyleClass",i.tooltipStyleClass),c(),d(i.cx("label")),r("pBind",i.ptm("label")),f("data-p",i.labelDataP),c(),r("ngIf",!i.selectedItemsTemplate&&!i._selectedItemsTemplate),c(),r("ngIf",i.selectedItemsTemplate||i._selectedItemsTemplate),c(),r("ngIf",i.isVisibleClearIcon),c(),d(i.cx("dropdown")),r("pBind",i.ptm("dropdown")),c(),r("ngIf",i.loading)("ngIfElse",l),c(3),r("hostAttrSelector",i.$attrSelector),We("visible",i.overlayVisible),r("options",i.overlayOptions)("target","@parent")("appendTo",i.$appendTo())("unstyled",i.unstyled())("pt",i.ptm("pcOverlay"))("motionOptions",i.motionOptions())}},dependencies:[W,Ie,Xe,ue,U,et,vl,St,V,Ot,wt,we,ft,yt,vt,bt,xt,Ct,It,Re,Ne,He,Pe,ze,Oe,M],encapsulation:2,changeDetection:0})}return t})(),$o=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=te({type:t});static \u0275inj=ee({imports:[Rt,V,V]})}return t})();var $t=`
    .p-toggleswitch {
        display: inline-block;
        width: dt('toggleswitch.width');
        height: dt('toggleswitch.height');
    }

    .p-toggleswitch-input {
        cursor: pointer;
        appearance: none;
        position: absolute;
        top: 0;
        inset-inline-start: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        opacity: 0;
        z-index: 1;
        outline: 0 none;
        border-radius: dt('toggleswitch.border.radius');
    }

    .p-toggleswitch-slider {
        cursor: pointer;
        width: 100%;
        height: 100%;
        border-width: dt('toggleswitch.border.width');
        border-style: solid;
        border-color: dt('toggleswitch.border.color');
        background: dt('toggleswitch.background');
        transition:
            background dt('toggleswitch.transition.duration'),
            color dt('toggleswitch.transition.duration'),
            border-color dt('toggleswitch.transition.duration'),
            outline-color dt('toggleswitch.transition.duration'),
            box-shadow dt('toggleswitch.transition.duration');
        border-radius: dt('toggleswitch.border.radius');
        outline-color: transparent;
        box-shadow: dt('toggleswitch.shadow');
    }

    .p-toggleswitch-handle {
        position: absolute;
        top: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: dt('toggleswitch.handle.background');
        color: dt('toggleswitch.handle.color');
        width: dt('toggleswitch.handle.size');
        height: dt('toggleswitch.handle.size');
        inset-inline-start: dt('toggleswitch.gap');
        margin-block-start: calc(-1 * calc(dt('toggleswitch.handle.size') / 2));
        border-radius: dt('toggleswitch.handle.border.radius');
        transition:
            background dt('toggleswitch.transition.duration'),
            color dt('toggleswitch.transition.duration'),
            inset-inline-start dt('toggleswitch.slide.duration'),
            box-shadow dt('toggleswitch.slide.duration');
    }

    .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider {
        background: dt('toggleswitch.checked.background');
        border-color: dt('toggleswitch.checked.border.color');
    }

    .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.checked.background');
        color: dt('toggleswitch.handle.checked.color');
        inset-inline-start: calc(dt('toggleswitch.width') - calc(dt('toggleswitch.handle.size') + dt('toggleswitch.gap')));
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover) .p-toggleswitch-slider {
        background: dt('toggleswitch.hover.background');
        border-color: dt('toggleswitch.hover.border.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover) .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.hover.background');
        color: dt('toggleswitch.handle.hover.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover).p-toggleswitch-checked .p-toggleswitch-slider {
        background: dt('toggleswitch.checked.hover.background');
        border-color: dt('toggleswitch.checked.hover.border.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover).p-toggleswitch-checked .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.checked.hover.background');
        color: dt('toggleswitch.handle.checked.hover.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:focus-visible) .p-toggleswitch-slider {
        box-shadow: dt('toggleswitch.focus.ring.shadow');
        outline: dt('toggleswitch.focus.ring.width') dt('toggleswitch.focus.ring.style') dt('toggleswitch.focus.ring.color');
        outline-offset: dt('toggleswitch.focus.ring.offset');
    }

    .p-toggleswitch.p-invalid > .p-toggleswitch-slider {
        border-color: dt('toggleswitch.invalid.border.color');
    }

    .p-toggleswitch.p-disabled {
        opacity: 1;
    }

    .p-toggleswitch.p-disabled .p-toggleswitch-slider {
        background: dt('toggleswitch.disabled.background');
    }

    .p-toggleswitch.p-disabled .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.disabled.background');
    }
`;var Il=["handle"],xl=["input"],Cl=t=>({checked:t});function Tl(t,a){t&1&&w(0)}function Sl(t,a){if(t&1&&p(0,Tl,1,0,"ng-container",3),t&2){let e=s();r("ngTemplateOutlet",e.handleTemplate||e._handleTemplate)("ngTemplateOutletContext",E(2,Cl,e.checked()))}}var wl=`
    ${$t}

    p-toggleswitch.ng-invalid.ng-dirty > .p-toggleswitch-slider {
        border-color: dt('toggleswitch.invalid.border.color');
    }
`,Ol={root:{position:"relative"}},kl={root:({instance:t})=>["p-toggleswitch p-component",{"p-toggleswitch p-component":!0,"p-toggleswitch-checked":t.checked(),"p-disabled":t.$disabled(),"p-invalid":t.invalid()}],input:"p-toggleswitch-input",slider:"p-toggleswitch-slider",handle:"p-toggleswitch-handle"},Kt=(()=>{class t extends se{name="toggleswitch";style=wl;classes=kl;inlineStyles=Ol;static \u0275fac=(()=>{let e;return function(i){return(e||(e=L(t)))(i||t)}})();static \u0275prov=H({token:t,factory:t.\u0275fac})}return t})();var jt=new K("TOGGLESWITCH_INSTANCE"),Ml={provide:Te,useExisting:ge(()=>qt),multi:!0},qt=(()=>{class t extends ke{componentName="ToggleSwitch";$pcToggleSwitch=k(jt,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=k(M,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}styleClass;tabindex;inputId;readonly;trueValue=!0;falseValue=!1;ariaLabel;size=$();ariaLabelledBy;autofocus;onChange=new S;input;handleTemplate;_handleTemplate;focused=!1;_componentStyle=k(Kt);templates;onHostClick(e){this.onClick(e)}onAfterContentInit(){this.templates.forEach(e=>{e.getType()==="handle"?this._handleTemplate=e.template:this._handleTemplate=e.template})}onClick(e){!this.$disabled()&&!this.readonly&&(this.writeModelValue(this.checked()?this.falseValue:this.trueValue),this.onModelChange(this.modelValue()),this.onChange.emit({originalEvent:e,checked:this.modelValue()}),this.input.nativeElement.focus())}onFocus(){this.focused=!0}onBlur(){this.focused=!1,this.onModelTouched()}checked(){return this.modelValue()===this.trueValue}writeControlValue(e,n){n(e),this.cd.markForCheck()}get dataP(){return this.cn({checked:this.checked(),disabled:this.$disabled(),invalid:this.invalid()})}static \u0275fac=(()=>{let e;return function(i){return(e||(e=L(t)))(i||t)}})();static \u0275cmp=D({type:t,selectors:[["p-toggleswitch"],["p-toggleSwitch"],["p-toggle-switch"]],contentQueries:function(n,i,l){if(n&1&&oe(l,Il,4)(l,re,4),n&2){let o;h(o=g())&&(i.handleTemplate=o.first),h(o=g())&&(i.templates=o)}},viewQuery:function(n,i){if(n&1&&ye(xl,5),n&2){let l;h(l=g())&&(i.input=l.first)}},hostVars:7,hostBindings:function(n,i){n&1&&x("click",function(o){return i.onHostClick(o)}),n&2&&(f("data-p-checked",i.checked())("data-p-disabled",i.$disabled())("data-p",i.dataP),N(i.sx("root")),d(i.cn(i.cx("root"),i.styleClass)))},inputs:{styleClass:"styleClass",tabindex:[2,"tabindex","tabindex",Q],inputId:"inputId",readonly:[2,"readonly","readonly",b],trueValue:"trueValue",falseValue:"falseValue",ariaLabel:"ariaLabel",size:[1,"size"],ariaLabelledBy:"ariaLabelledBy",autofocus:[2,"autofocus","autofocus",b]},outputs:{onChange:"onChange"},features:[G([Ml,Kt,{provide:jt,useExisting:t},{provide:ce,useExisting:t}]),ie([M]),P],decls:5,vars:22,consts:[["input",""],["type","checkbox","role","switch",3,"focus","blur","checked","pAutoFocus","pBind"],[3,"pBind"],[4,"ngTemplateOutlet","ngTemplateOutletContext"]],template:function(n,i){n&1&&(m(0,"input",1,0),x("focus",function(){return i.onFocus()})("blur",function(){return i.onBlur()}),_(),m(2,"div",2)(3,"div",2),ne(4,Sl,1,4,"ng-container"),_()()),n&2&&(d(i.cx("input")),r("checked",i.checked())("pAutoFocus",i.autofocus)("pBind",i.ptm("input")),f("id",i.inputId)("required",i.required()?"":void 0)("disabled",i.$disabled()?"":void 0)("aria-checked",i.checked())("aria-labelledby",i.ariaLabelledBy)("aria-label",i.ariaLabel)("name",i.name())("tabindex",i.tabindex),c(2),d(i.cx("slider")),r("pBind",i.ptm("slider")),f("data-p",i.dataP),c(),d(i.cx("handle")),r("pBind",i.ptm("handle")),f("data-p",i.dataP),c(),le(i.handleTemplate||i._handleTemplate?4:-1))},dependencies:[W,U,we,V,Oe,M],encapsulation:2,changeDetection:0})}return t})(),_a=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=te({type:t});static \u0275inj=ee({imports:[qt,V,V]})}return t})();export{Vt as a,Re as b,io as c,Rt as d,$o as e,Mt as f,qt as g,_a as h};
