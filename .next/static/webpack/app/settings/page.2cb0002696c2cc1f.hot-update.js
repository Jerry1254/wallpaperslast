"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/settings/page",{

/***/ "(app-pages-browser)/./app/settings/page.tsx":
/*!*******************************!*\
  !*** ./app/settings/page.tsx ***!
  \*******************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ SettingsPage; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _components_ui_button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/components/ui/button */ \"(app-pages-browser)/./components/ui/button.tsx\");\n/* harmony import */ var _components_ui_input__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/components/ui/input */ \"(app-pages-browser)/./components/ui/input.tsx\");\n/* harmony import */ var _components_ui_use_toast__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/components/ui/use-toast */ \"(app-pages-browser)/./components/ui/use-toast.ts\");\n/* harmony import */ var _components_ui_card__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/components/ui/card */ \"(app-pages-browser)/./components/ui/card.tsx\");\n/* harmony import */ var _components_admin_layout__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/components/admin-layout */ \"(app-pages-browser)/./components/admin-layout.tsx\");\n/* harmony import */ var next_dynamic__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! next/dynamic */ \"(app-pages-browser)/./node_modules/next/dist/api/app-dynamic.js\");\n/* harmony import */ var _quill_css__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./quill.css */ \"(app-pages-browser)/./app/settings/quill.css\");\n/* __next_internal_client_entry_do_not_use__ default auto */ \nvar _s = $RefreshSig$(), _s1 = $RefreshSig$();\n\n\n\n\n\n\n\n\n// 动态导入富文本编辑器\nconst ReactQuill = (0,next_dynamic__WEBPACK_IMPORTED_MODULE_7__[\"default\"])(()=>__webpack_require__.e(/*! import() */ \"_app-pages-browser_node_modules_react-quill_lib_index_js\").then(__webpack_require__.t.bind(__webpack_require__, /*! react-quill */ \"(app-pages-browser)/./node_modules/react-quill/lib/index.js\", 23)).then((mod)=>{\n        const formats = [\n            \"header\",\n            \"bold\",\n            \"italic\",\n            \"underline\",\n            \"strike\",\n            \"color\",\n            \"background\",\n            \"align\",\n            \"clean\"\n        ];\n        return function CustomQuill(props) {\n            return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(mod.default, {\n                ...props,\n                formats: formats\n            }, void 0, false, {\n                fileName: \"/Users/kele/Desktop/aicode/wallpaper-admin-last/app/settings/page.tsx\",\n                lineNumber: 24,\n                columnNumber: 14\n            }, this);\n        };\n    }), {\n    loadableGenerated: {\n        modules: [\n            \"app/settings/page.tsx -> \" + \"react-quill\"\n        ]\n    },\n    ssr: false,\n    loading: ()=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n            className: \"h-40 w-full animate-pulse bg-gray-100 rounded-lg\"\n        }, void 0, false, {\n            fileName: \"/Users/kele/Desktop/aicode/wallpaper-admin-last/app/settings/page.tsx\",\n            lineNumber: 29,\n            columnNumber: 20\n        }, undefined)\n});\n_c = ReactQuill;\nfunction QuillEditor(param) {\n    let { value, onChange } = param;\n    _s();\n    const [mounted, setMounted] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        setMounted(true);\n    }, []);\n    if (!mounted) {\n        return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n            className: \"h-40 w-full animate-pulse bg-gray-100 rounded-lg\"\n        }, void 0, false, {\n            fileName: \"/Users/kele/Desktop/aicode/wallpaper-admin-last/app/settings/page.tsx\",\n            lineNumber: 46,\n            columnNumber: 12\n        }, this);\n    }\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(ReactQuill, {\n        theme: \"snow\",\n        value: value,\n        onChange: onChange,\n        modules: {\n            toolbar: [\n                [\n                    {\n                        \"header\": [\n                            1,\n                            2,\n                            3,\n                            4,\n                            5,\n                            6,\n                            false\n                        ]\n                    }\n                ],\n                [\n                    \"bold\",\n                    \"italic\",\n                    \"underline\",\n                    \"strike\"\n                ],\n                [\n                    {\n                        \"color\": []\n                    },\n                    {\n                        \"background\": []\n                    }\n                ],\n                [\n                    {\n                        \"align\": []\n                    }\n                ],\n                [\n                    \"clean\"\n                ]\n            ]\n        }\n    }, void 0, false, {\n        fileName: \"/Users/kele/Desktop/aicode/wallpaper-admin-last/app/settings/page.tsx\",\n        lineNumber: 50,\n        columnNumber: 5\n    }, this);\n}\n_s(QuillEditor, \"LrrVfNW3d1raFE0BNzCTILYmIfo=\");\n_c1 = QuillEditor;\nfunction SettingsContent() {\n    _s1();\n    const [settings, setSettings] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({\n        share_header_text: \"\",\n        share_button_text: \"\"\n    });\n    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const { toast } = (0,_components_ui_use_toast__WEBPACK_IMPORTED_MODULE_4__.useToast)();\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        fetchSettings();\n    }, []);\n    const fetchSettings = async ()=>{\n        try {\n            const response = await fetch(\"/api/settings\");\n            const result = await response.json();\n            if (result.code === 0 && result.data) {\n                setSettings(result.data);\n            }\n        } catch (error) {\n            toast({\n                variant: \"destructive\",\n                description: \"获取设置失败\"\n            });\n        }\n    };\n    const handleSave = async ()=>{\n        if (!settings.share_header_text.trim() || !settings.share_button_text.trim()) {\n            toast({\n                variant: \"destructive\",\n                description: \"所有字段都不能为空\"\n            });\n            return;\n        }\n        try {\n            setLoading(true);\n            const response = await fetch(\"/api/settings\", {\n                method: \"POST\",\n                headers: {\n                    \"Content-Type\": \"application/json\"\n                },\n                body: JSON.stringify(settings)\n            });\n            const result = await response.json();\n            if (result.code === 0) {\n                toast({\n                    description: \"保存成功\"\n                });\n            } else {\n                throw new Error(result.message);\n            }\n        } catch (error) {\n            toast({\n                variant: \"destructive\",\n                description: \"保存失败\"\n            });\n        } finally{\n            setLoading(false);\n        }\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"space-y-6\",\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_card__WEBPACK_IMPORTED_MODULE_5__.Card, {\n            children: [\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_card__WEBPACK_IMPORTED_MODULE_5__.CardHeader, {\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_card__WEBPACK_IMPORTED_MODULE_5__.CardTitle, {\n                            children: \"分享页设置\"\n                        }, void 0, false, {\n                            fileName: \"/Users/kele/Desktop/aicode/wallpaper-admin-last/app/settings/page.tsx\",\n                            lineNumber: 135,\n                            columnNumber: 11\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_card__WEBPACK_IMPORTED_MODULE_5__.CardDescription, {\n                            children: \"设置分享页面的显示内容和分享按钮文本\"\n                        }, void 0, false, {\n                            fileName: \"/Users/kele/Desktop/aicode/wallpaper-admin-last/app/settings/page.tsx\",\n                            lineNumber: 136,\n                            columnNumber: 11\n                        }, this)\n                    ]\n                }, void 0, true, {\n                    fileName: \"/Users/kele/Desktop/aicode/wallpaper-admin-last/app/settings/page.tsx\",\n                    lineNumber: 134,\n                    columnNumber: 9\n                }, this),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_card__WEBPACK_IMPORTED_MODULE_5__.CardContent, {\n                    className: \"space-y-6\",\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                            className: \"space-y-2\",\n                            children: [\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"label\", {\n                                    className: \"text-sm font-medium\",\n                                    children: \"分享页描述\"\n                                }, void 0, false, {\n                                    fileName: \"/Users/kele/Desktop/aicode/wallpaper-admin-last/app/settings/page.tsx\",\n                                    lineNumber: 142,\n                                    columnNumber: 13\n                                }, this),\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(QuillEditor, {\n                                    value: settings.share_header_text,\n                                    onChange: (value)=>setSettings((prev)=>({\n                                                ...prev,\n                                                share_header_text: value\n                                            }))\n                                }, void 0, false, {\n                                    fileName: \"/Users/kele/Desktop/aicode/wallpaper-admin-last/app/settings/page.tsx\",\n                                    lineNumber: 143,\n                                    columnNumber: 13\n                                }, this)\n                            ]\n                        }, void 0, true, {\n                            fileName: \"/Users/kele/Desktop/aicode/wallpaper-admin-last/app/settings/page.tsx\",\n                            lineNumber: 141,\n                            columnNumber: 11\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                            className: \"space-y-2 mt-16\",\n                            children: [\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"label\", {\n                                    className: \"text-sm font-medium\",\n                                    children: \"分享按钮文本\"\n                                }, void 0, false, {\n                                    fileName: \"/Users/kele/Desktop/aicode/wallpaper-admin-last/app/settings/page.tsx\",\n                                    lineNumber: 150,\n                                    columnNumber: 13\n                                }, this),\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_input__WEBPACK_IMPORTED_MODULE_3__.Input, {\n                                    value: settings.share_button_text,\n                                    onChange: (e)=>setSettings((prev)=>({\n                                                ...prev,\n                                                share_button_text: e.target.value\n                                            })),\n                                    placeholder: \"请输入分享按钮文本\"\n                                }, void 0, false, {\n                                    fileName: \"/Users/kele/Desktop/aicode/wallpaper-admin-last/app/settings/page.tsx\",\n                                    lineNumber: 151,\n                                    columnNumber: 13\n                                }, this),\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                                    className: \"text-sm text-gray-500\",\n                                    children: [\n                                        \"此文本将与分享链接拼接，例如：\",\n                                        settings.share_button_text,\n                                        \" http://example.com/share/123\"\n                                    ]\n                                }, void 0, true, {\n                                    fileName: \"/Users/kele/Desktop/aicode/wallpaper-admin-last/app/settings/page.tsx\",\n                                    lineNumber: 156,\n                                    columnNumber: 13\n                                }, this)\n                            ]\n                        }, void 0, true, {\n                            fileName: \"/Users/kele/Desktop/aicode/wallpaper-admin-last/app/settings/page.tsx\",\n                            lineNumber: 149,\n                            columnNumber: 11\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_button__WEBPACK_IMPORTED_MODULE_2__.Button, {\n                            onClick: handleSave,\n                            disabled: loading,\n                            className: \"w-full\",\n                            children: loading ? \"保存中...\" : \"保存设置\"\n                        }, void 0, false, {\n                            fileName: \"/Users/kele/Desktop/aicode/wallpaper-admin-last/app/settings/page.tsx\",\n                            lineNumber: 161,\n                            columnNumber: 11\n                        }, this)\n                    ]\n                }, void 0, true, {\n                    fileName: \"/Users/kele/Desktop/aicode/wallpaper-admin-last/app/settings/page.tsx\",\n                    lineNumber: 140,\n                    columnNumber: 9\n                }, this)\n            ]\n        }, void 0, true, {\n            fileName: \"/Users/kele/Desktop/aicode/wallpaper-admin-last/app/settings/page.tsx\",\n            lineNumber: 133,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/kele/Desktop/aicode/wallpaper-admin-last/app/settings/page.tsx\",\n        lineNumber: 132,\n        columnNumber: 5\n    }, this);\n}\n_s1(SettingsContent, \"FEelKCoWC6bXq2cUwFpbrKcJQFM=\", false, function() {\n    return [\n        _components_ui_use_toast__WEBPACK_IMPORTED_MODULE_4__.useToast\n    ];\n});\n_c2 = SettingsContent;\nfunction SettingsPage() {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_admin_layout__WEBPACK_IMPORTED_MODULE_6__.AdminLayout, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(SettingsContent, {}, void 0, false, {\n            fileName: \"/Users/kele/Desktop/aicode/wallpaper-admin-last/app/settings/page.tsx\",\n            lineNumber: 177,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/kele/Desktop/aicode/wallpaper-admin-last/app/settings/page.tsx\",\n        lineNumber: 176,\n        columnNumber: 5\n    }, this);\n}\n_c3 = SettingsPage;\nvar _c, _c1, _c2, _c3;\n$RefreshReg$(_c, \"ReactQuill\");\n$RefreshReg$(_c1, \"QuillEditor\");\n$RefreshReg$(_c2, \"SettingsContent\");\n$RefreshReg$(_c3, \"SettingsPage\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2FwcC9zZXR0aW5ncy9wYWdlLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBRTJDO0FBQ0k7QUFDRjtBQUNPO0FBQzRDO0FBQ3pDO0FBQ3JCO0FBQ2Q7QUFFcEIsYUFBYTtBQUNiLE1BQU1ZLGFBQWFELHdEQUFPQSxDQUN4QixJQUFNLDZPQUFPLENBQWVFLElBQUksQ0FBQyxDQUFDQztRQUNoQyxNQUFNQyxVQUFVO1lBQ2Q7WUFDQTtZQUFRO1lBQVU7WUFBYTtZQUMvQjtZQUFTO1lBQ1Q7WUFDQTtTQUNEO1FBRUQsT0FBTyxTQUFTQyxZQUFZQyxLQUFVO1lBQ3BDLHFCQUFPLDhEQUFDSCxJQUFJSSxPQUFPO2dCQUFFLEdBQUdELEtBQUs7Z0JBQUVGLFNBQVNBOzs7Ozs7UUFDMUM7SUFDRjs7Ozs7O0lBRUVJLEtBQUs7SUFDTEMsU0FBUyxrQkFBTSw4REFBQ0M7WUFBSUMsV0FBVTs7Ozs7OztLQWhCNUJWO0FBeUJOLFNBQVNXLFlBQVksS0FBeUU7UUFBekUsRUFBRUMsS0FBSyxFQUFFQyxRQUFRLEVBQXdELEdBQXpFOztJQUNuQixNQUFNLENBQUNDLFNBQVNDLFdBQVcsR0FBRzFCLCtDQUFRQSxDQUFDO0lBRXZDRCxnREFBU0EsQ0FBQztRQUNSMkIsV0FBVztJQUNiLEdBQUcsRUFBRTtJQUVMLElBQUksQ0FBQ0QsU0FBUztRQUNaLHFCQUFPLDhEQUFDTDtZQUFJQyxXQUFVOzs7Ozs7SUFDeEI7SUFFQSxxQkFDRSw4REFBQ1Y7UUFDQ2dCLE9BQU07UUFDTkosT0FBT0E7UUFDUEMsVUFBVUE7UUFDVkksU0FBUztZQUNQQyxTQUFTO2dCQUNQO29CQUFDO3dCQUFFLFVBQVU7NEJBQUM7NEJBQUc7NEJBQUc7NEJBQUc7NEJBQUc7NEJBQUc7NEJBQUc7eUJBQU07b0JBQUM7aUJBQUU7Z0JBQ3pDO29CQUFDO29CQUFRO29CQUFVO29CQUFhO2lCQUFTO2dCQUN6QztvQkFBQzt3QkFBRSxTQUFTLEVBQUU7b0JBQUM7b0JB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Ozs7OztzQ0FJL0MsOERBQUNqQyx5REFBTUE7NEJBQ0w2RCxTQUFTZjs0QkFDVGdCLFVBQVU1Qzs0QkFDVkUsV0FBVTtzQ0FFVEYsVUFBVSxXQUFXOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU1sQztJQXpHU1c7O1FBTVczQiw4REFBUUE7OztNQU5uQjJCO0FBMkdNLFNBQVNrQztJQUN0QixxQkFDRSw4REFBQ3ZELGlFQUFXQTtrQkFDViw0RUFBQ3FCOzs7Ozs7Ozs7O0FBR1A7TUFOd0JrQyIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9hcHAvc2V0dGluZ3MvcGFnZS50c3g/MGZiOSJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBjbGllbnRcIlxuXG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCJAL2NvbXBvbmVudHMvdWkvYnV0dG9uXCJcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIkAvY29tcG9uZW50cy91aS9pbnB1dFwiXG5pbXBvcnQgeyB1c2VUb2FzdCB9IGZyb20gXCJAL2NvbXBvbmVudHMvdWkvdXNlLXRvYXN0XCJcbmltcG9ydCB7IENhcmQsIENhcmRDb250ZW50LCBDYXJkRGVzY3JpcHRpb24sIENhcmRIZWFkZXIsIENhcmRUaXRsZSB9IGZyb20gXCJAL2NvbXBvbmVudHMvdWkvY2FyZFwiXG5pbXBvcnQgeyBBZG1pbkxheW91dCB9IGZyb20gXCJAL2NvbXBvbmVudHMvYWRtaW4tbGF5b3V0XCJcbmltcG9ydCBkeW5hbWljIGZyb20gXCJuZXh0L2R5bmFtaWNcIlxuaW1wb3J0IFwiLi9xdWlsbC5jc3NcIlxuXG4vLyDliqjmgIHlr7zlhaXlr4zmlofmnKznvJbovpHlmahcbmNvbnN0IFJlYWN0UXVpbGwgPSBkeW5hbWljKFxuICAoKSA9PiBpbXBvcnQoJ3JlYWN0LXF1aWxsJykudGhlbigobW9kKSA9PiB7XG4gICAgY29uc3QgZm9ybWF0cyA9IFtcbiAgICAgICdoZWFkZXInLFxuICAgICAgJ2JvbGQnLCAnaXRhbGljJywgJ3VuZGVybGluZScsICdzdHJpa2UnLFxuICAgICAgJ2NvbG9yJywgJ2JhY2tncm91bmQnLFxuICAgICAgJ2FsaWduJyxcbiAgICAgICdjbGVhbidcbiAgICBdXG4gICAgXG4gICAgcmV0dXJuIGZ1bmN0aW9uIEN1c3RvbVF1aWxsKHByb3BzOiBhbnkpIHtcbiAgICAgIHJldHVybiA8bW9kLmRlZmF1bHQgey4uLnByb3BzfSBmb3JtYXRzPXtmb3JtYXRzfSAvPlxuICAgIH1cbiAgfSksXG4gIHsgXG4gICAgc3NyOiBmYWxzZSxcbiAgICBsb2FkaW5nOiAoKSA9PiA8ZGl2IGNsYXNzTmFtZT1cImgtNDAgdy1mdWxsIGFuaW1hdGUtcHVsc2UgYmctZ3JheS0xMDAgcm91bmRlZC1sZ1wiIC8+XG4gIH1cbilcblxuaW50ZXJmYWNlIFNldHRpbmdzIHtcbiAgc2hhcmVfaGVhZGVyX3RleHQ6IHN0cmluZ1xuICBzaGFyZV9idXR0b25fdGV4dDogc3RyaW5nXG59XG5cbmZ1bmN0aW9uIFF1aWxsRWRpdG9yKHsgdmFsdWUsIG9uQ2hhbmdlIH06IHsgdmFsdWU6IHN0cmluZzsgb25DaGFuZ2U6ICh2YWx1ZTogc3RyaW5nKSA9PiB2b2lkIH0pIHtcbiAgY29uc3QgW21vdW50ZWQsIHNldE1vdW50ZWRdID0gdXNlU3RhdGUoZmFsc2UpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBzZXRNb3VudGVkKHRydWUpXG4gIH0sIFtdKVxuXG4gIGlmICghbW91bnRlZCkge1xuICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImgtNDAgdy1mdWxsIGFuaW1hdGUtcHVsc2UgYmctZ3JheS0xMDAgcm91bmRlZC1sZ1wiIC8+XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxSZWFjdFF1aWxsXG4gICAgICB0aGVtZT1cInNub3dcIlxuICAgICAgdmFsdWU9e3ZhbHVlfVxuICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgbW9kdWxlcz17e1xuICAgICAgICB0b29sYmFyOiBbXG4gICAgICAgICAgW3sgJ2hlYWRlcic6IFsxLCAyLCAzLCA0LCA1LCA2LCBmYWxzZV0gfV0sXG4gICAgICAgICAgWydib2xkJywgJ2l0YWxpYycsICd1bmRlcmxpbmUnLCAnc3RyaWtlJ10sXG4gICAgICAgICAgW3sgJ2NvbG9yJzogW10gfSwgeyAnYmFja2dyb3VuZCc6IFtdIH1dLFxuICAgICAgICAgIFt7ICdhbGlnbic6IFtdIH1dLFxuICAgICAgICAgIFsnY2xlYW4nXVxuICAgICAgICBdXG4gICAgICB9fVxuICAgIC8+XG4gIClcbn1cblxuZnVuY3Rpb24gU2V0dGluZ3NDb250ZW50KCkge1xuICBjb25zdCBbc2V0dGluZ3MsIHNldFNldHRpbmdzXSA9IHVzZVN0YXRlPFNldHRpbmdzPih7XG4gICAgc2hhcmVfaGVhZGVyX3RleHQ6ICcnLFxuICAgIHNoYXJlX2J1dHRvbl90ZXh0OiAnJ1xuICB9KVxuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgeyB0b2FzdCB9ID0gdXNlVG9hc3QoKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgZmV0Y2hTZXR0aW5ncygpXG4gIH0sIFtdKVxuXG4gIGNvbnN0IGZldGNoU2V0dGluZ3MgPSBhc3luYyAoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goJy9hcGkvc2V0dGluZ3MnKVxuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXG4gICAgICBpZiAocmVzdWx0LmNvZGUgPT09IDAgJiYgcmVzdWx0LmRhdGEpIHtcbiAgICAgICAgc2V0U2V0dGluZ3MocmVzdWx0LmRhdGEpXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRvYXN0KHtcbiAgICAgICAgdmFyaWFudDogXCJkZXN0cnVjdGl2ZVwiLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ+iOt+WPluiuvue9ruWksei0pSdcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgY29uc3QgaGFuZGxlU2F2ZSA9IGFzeW5jICgpID0+IHtcbiAgICBpZiAoIXNldHRpbmdzLnNoYXJlX2hlYWRlcl90ZXh0LnRyaW0oKSB8fCAhc2V0dGluZ3Muc2hhcmVfYnV0dG9uX3RleHQudHJpbSgpKSB7XG4gICAgICB0b2FzdCh7XG4gICAgICAgIHZhcmlhbnQ6IFwiZGVzdHJ1Y3RpdmVcIixcbiAgICAgICAgZGVzY3JpcHRpb246ICfmiYDmnInlrZfmrrXpg73kuI3og73kuLrnqbonXG4gICAgICB9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHNldExvYWRpbmcodHJ1ZSlcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goJy9hcGkvc2V0dGluZ3MnLCB7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICB9LFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShzZXR0aW5ncylcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxuICAgICAgaWYgKHJlc3VsdC5jb2RlID09PSAwKSB7XG4gICAgICAgIHRvYXN0KHtcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ+S/neWtmOaIkOWKnydcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihyZXN1bHQubWVzc2FnZSlcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdG9hc3Qoe1xuICAgICAgICB2YXJpYW50OiBcImRlc3RydWN0aXZlXCIsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAn5L+d5a2Y5aSx6LSlJ1xuICAgICAgfSlcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0TG9hZGluZyhmYWxzZSlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS02XCI+XG4gICAgICA8Q2FyZD5cbiAgICAgICAgPENhcmRIZWFkZXI+XG4gICAgICAgICAgPENhcmRUaXRsZT7liIbkuqvpobXorr7nva48L0NhcmRUaXRsZT5cbiAgICAgICAgICA8Q2FyZERlc2NyaXB0aW9uPlxuICAgICAgICAgICAg6K6+572u5YiG5Lqr6aG16Z2i55qE5pi+56S65YaF5a655ZKM5YiG5Lqr5oyJ6ZKu5paH5pysXG4gICAgICAgICAgPC9DYXJkRGVzY3JpcHRpb24+XG4gICAgICAgIDwvQ2FyZEhlYWRlcj5cbiAgICAgICAgPENhcmRDb250ZW50IGNsYXNzTmFtZT1cInNwYWNlLXktNlwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0yXCI+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC1zbSBmb250LW1lZGl1bVwiPuWIhuS6q+mhteaPj+i/sDwvbGFiZWw+XG4gICAgICAgICAgICA8UXVpbGxFZGl0b3JcbiAgICAgICAgICAgICAgdmFsdWU9e3NldHRpbmdzLnNoYXJlX2hlYWRlcl90ZXh0fVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KHZhbHVlKSA9PiBzZXRTZXR0aW5ncyhwcmV2ID0+ICh7IC4uLnByZXYsIHNoYXJlX2hlYWRlcl90ZXh0OiB2YWx1ZSB9KSl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTIgbXQtMTZcIj5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtbWVkaXVtXCI+5YiG5Lqr5oyJ6ZKu5paH5pysPC9sYWJlbD5cbiAgICAgICAgICAgIDxJbnB1dFxuICAgICAgICAgICAgICB2YWx1ZT17c2V0dGluZ3Muc2hhcmVfYnV0dG9uX3RleHR9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0U2V0dGluZ3MocHJldiA9PiAoeyAuLi5wcmV2LCBzaGFyZV9idXR0b25fdGV4dDogZS50YXJnZXQudmFsdWUgfSkpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIuivt+i+k+WFpeWIhuS6q+aMiemSruaWh+acrFwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LWdyYXktNTAwXCI+XG4gICAgICAgICAgICAgIOatpOaWh+acrOWwhuS4juWIhuS6q+mTvuaOpeaLvOaOpe+8jOS+i+Wmgu+8mntzZXR0aW5ncy5zaGFyZV9idXR0b25fdGV4dH0gaHR0cDovL2V4YW1wbGUuY29tL3NoYXJlLzEyM1xuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPEJ1dHRvbiBcbiAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZVNhdmV9IFxuICAgICAgICAgICAgZGlzYWJsZWQ9e2xvYWRpbmd9XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGxcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtsb2FkaW5nID8gJ+S/neWtmOS4rS4uLicgOiAn5L+d5a2Y6K6+572uJ31cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9DYXJkQ29udGVudD5cbiAgICAgIDwvQ2FyZD5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTZXR0aW5nc1BhZ2UoKSB7XG4gIHJldHVybiAoXG4gICAgPEFkbWluTGF5b3V0PlxuICAgICAgPFNldHRpbmdzQ29udGVudCAvPlxuICAgIDwvQWRtaW5MYXlvdXQ+XG4gIClcbn1cbiJdLCJuYW1lcyI6WyJ1c2VFZmZlY3QiLCJ1c2VTdGF0ZSIsIkJ1dHRvbiIsIklucHV0IiwidXNlVG9hc3QiLCJDYXJkIiwiQ2FyZENvbnRlbnQiLCJDYXJkRGVzY3JpcHRpb24iLCJDYXJkSGVhZGVyIiwiQ2FyZFRpdGxlIiwiQWRtaW5MYXlvdXQiLCJkeW5hbWljIiwiUmVhY3RRdWlsbCIsInRoZW4iLCJtb2QiLCJmb3JtYXRzIiwiQ3VzdG9tUXVpbGwiLCJwcm9wcyIsImRlZmF1bHQiLCJzc3IiLCJsb2FkaW5nIiwiZGl2IiwiY2xhc3NOYW1lIiwiUXVpbGxFZGl0b3IiLCJ2YWx1ZSIsIm9uQ2hhbmdlIiwibW91bnRlZCIsInNldE1vdW50ZWQiLCJ0aGVtZSIsIm1vZHVsZXMiLCJ0b29sYmFyIiwiU2V0dGluZ3NDb250ZW50Iiwic2V0dGluZ3MiLCJzZXRTZXR0aW5ncyIsInNoYXJlX2hlYWRlcl90ZXh0Iiwic2hhcmVfYnV0dG9uX3RleHQiLCJzZXRMb2FkaW5nIiwidG9hc3QiLCJmZXRjaFNldHRpbmdzIiwicmVzcG9uc2UiLCJmZXRjaCIsInJlc3VsdCIsImpzb24iLCJjb2RlIiwiZGF0YSIsImVycm9yIiwidmFyaWFudCIsImRlc2NyaXB0aW9uIiwiaGFuZGxlU2F2ZSIsInRyaW0iLCJtZXRob2QiLCJoZWFkZXJzIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJFcnJvciIsIm1lc3NhZ2UiLCJsYWJlbCIsInByZXYiLCJlIiwidGFyZ2V0IiwicGxhY2Vob2xkZXIiLCJwIiwib25DbGljayIsImRpc2FibGVkIiwiU2V0dGluZ3NQYWdlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./app/settings/page.tsx\n"));

/***/ })

});