/* CS Call Connector  */
jQuery(function ($) {
    $(".btnNext").on('click',function (event) {
        event.preventDefault();
        $(".Error1").val("");
        $(".newValue").val("");
        var ServiceUrl = $('#ServiceUrl').val();
        var f2j = formToJSON();
        $.ajax({
            url: ServiceUrl+"api/v1/CCtor/" + $('#Id').val(),
            type: 'POST',
            dataType: "json",
            contentType: 'application/json',
            data: f2j,
            error: function (xhr, ajaxOptions, thrownError) {
                $("#loader").hide();
                $(".Error1").val(xhr.status + " " + xhr.responseText);
                return false;
            },
            success: function (data, textStatus, jqXHR) {
                $(".newSecret").val(data.Ky);
                var k2          = data.Ky;
                var pb          = $("#Pb").val();
                if (data.Cd == 0) {
                    $.ajax({
                        url: ServiceUrl+"api/v1/CCtor/" + $('#Id').val(),
                        type: 'PUT',
                        dataType: "json",
                        contentType: 'application/json',
                        data: formToJSON1(k2, pb),
                        error: function (xhr, ajaxOptions, thrownError) {
                            $("#loader").hide();
                            $(".Error1").val(xhr.status + " " + xhr.responseText);
                            return false;
                        },
                        success: function (data, textStatus, jqXHR) {
                            if (data.Cd == 0) {
                                $(".newValue").val(data.Vl);
                            }
                            else {
                                $(".Error1").val("Status Ok but Error: " + data.Cd);
                            }
                        }
                    })
                }
                else {
                    $(".Error1").val("Status Ok but Error: " + data.Cd);
                }
            }
        });
    }),
    $(".btnRead").on("click", function (event) {
        event.preventDefault();
        $(".Error1").val("");
        $(".newValue").val("");
        var ServiceUrl = $('#ServiceUrl').val();
        var f2j = formToJSON();
        $.ajax({
            url: ServiceUrl+"api/v1/CCtor/" + $('#Id').val(),
            type: 'POST',
            dataType: "json",
            contentType: 'application/json',
            data: f2j,
            error: function (xhr, ajaxOptions, thrownError) {
                $("#loader").hide();
                $(".Error1").val(xhr.status + " " + xhr.responseText);
                return false;
            },
            success: function (data, textStatus, jqXHR) {
                $(".newSecret").val(data.Ky);
                var k2 = data.Ky;
                if (data.Cd == 0) {
                    $.ajax({
                        url: ServiceUrl+"api/v1/CCtor/" + $('#Id').val() + '?Ky=' + encodeURIComponent(k2),
                        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                        error: function (xhr, ajaxOptions, thrownError) {
                            $("#loader").hide();
                            $(".Error1").val(xhr.status + " " + xhr.responseText);
                            return false;
                        },
                        success: function (data, textStatus, jqXHR) {
                            if (data.Cd == 0) {
                                $(".newValue").val(data.Vl);
                            }
                            else {
                                $(".Error1").val("Status Ok but Error: " + data.Cd);
                            }
                        }
                    })
                }
                else {
                    $(".Error1").val("Status Ok but Error: " + data.Cd);
                }
            }
        });
    }),
    $(".btnStop").on("click", function (event) {
        event.preventDefault();
        $(".Error1").val("");
        $(".newValue").val("");
        var ServiceUrl = $('#ServiceUrl').val();
        var f2j = formToJSON();
        $.ajax({
            url: ServiceUrl+"api/v1/CCtor/" + $('#Id').val(),
            type: 'POST',
            dataType: "json",
            contentType: 'application/json',
            data: f2j,
            error: function (xhr, ajaxOptions, thrownError) {
                $("#loader").hide();
                $(".Error1").val(xhr.status + " " + xhr.responseText);
                return false;
            },
            success: function (data, textStatus, jqXHR) {
                $(".newSecret").val(data.Ky);
                var k2 = data.Ky;
                if (data.Cd == 0) {
                    $.ajax({
                        type: 'DELETE',
                        url: ServiceUrl+"api/v1/AdminCCtor/" + $('#Id').val() + '?Ky=' + encodeURIComponent(k2),
                        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                        error: function (xhr, ajaxOptions, thrownError) {
                            $("#loader").hide();
                            $(".Error1").val(xhr.status + " " + xhr.responseText);
                            return false;
                        },
                        success: function (data, textStatus, jqXHR) {
                            if (data.Cd == 0) {
                                $(".newValue").val('Inactive');
                            }
                            else {
                                $(".Error1").val("Status Ok but Error: " + data.Cd);
                            }
                        }
                    })
                }
                else {
                    $(".Error1").val("Status Ok but Error: " + data.Cd);
                }
            }
        });
    }),
    $(".btnStart").on("click", function (event) {
        event.preventDefault();
        $(".Error1").val("");
        $(".newValue").val("");
        var ServiceUrl = $('#ServiceUrl').val();
        var f2j = formToJSON();
        $.ajax({
            url: ServiceUrl+"api/v1/CCtor/" + $('#Id').val(),
            type: 'POST',
            dataType: "json",
            contentType: 'application/json',
            data: f2j,
            error: function (xhr, ajaxOptions, thrownError) {
                $("#loader").hide();
                $(".Error1").val(xhr.status + " " + xhr.responseText);
                return false;
            },
            success: function (data, textStatus, jqXHR) {
                $(".newSecret").val(data.Ky);
                var k2 = data.Ky;
                if (data.Cd == 0) {
                    $.ajax({
                        url: ServiceUrl+"api/v1/AdminCCtor/" + $('#Id').val(),
                        type: 'POST',
                        dataType: "json",
                        contentType: 'application/json',
                        data: formToJSON3(k2),
                        error: function (xhr, ajaxOptions, thrownError) {
                            $("#loader").hide();
                            $(".Error1").val(xhr.status + " " + xhr.responseText);
                            return false;
                        },
                        success: function (data, textStatus, jqXHR) {
                            if (data.Cd == 0) {
                                $(".newValue").val('Active');
                            }
                            else {
                                $(".Error1").val("Status Ok but Error: " + data.Cd);
                            }
                        }
                    })
                }
                else {
                    $(".Error1").val("Status Ok but Error: " + data.Cd);
                }
            }
        });
    }),
    $(".btnTrace").on("click", function (event) {
        event.preventDefault();
        $(".Error1").val("");
        $(".newValue").val("");
        var ServiceUrl = $('#ServiceUrl').val();
        var f2j = formToJSON();
        $.ajax({
            url: ServiceUrl+"api/v1/CCtor/" + $('#Id').val(),
            type: 'POST',
            dataType: "json",
            contentType: 'application/json',
            data: f2j,
            error: function (xhr, ajaxOptions, thrownError) {
                $("#loader").hide();
                $(".Error1").val(xhr.status + " " + xhr.responseText);
                return false;
            },
            success: function (data, textStatus, jqXHR) {
                $(".newSecret").val(data.Ky);
                var k2 = data.Ky;
                if (data.Cd == 0) {
                    $.ajax({
                        url: ServiceUrl+"api/v1/tracecctor/" + $('#Id').val(),
                        type: 'PUT',
                        dataType: "json",
                        contentType: 'application/json',
                        data: formToJSON4(k2),
                        error: function (xhr, ajaxOptions, thrownError) {
                            $("#loader").hide();
                            $(".Error1").val(xhr.status + " " + xhr.responseText);
                            return false;
                        },
                        success: function (data, textStatus, jqXHR) {
                            if (data.Cd == 0) {
                                $(".newValue").val(data.St);
                            }
                            else {
                                $(".Error1").val("Status Ok but Error: " + data.Cd);
                            }
                        }
                    })
                }
                else {
                    $(".Error1").val("Status Ok but Error: " + data.Cd);
                }
            }
        });
    }),
    $(".btnNextLoop").on("click", function (event) {
        event.preventDefault();
        $("#loader").show(); /* work only in FF */
        $(".newValue2").text("");
        $(".Error2").val("");
        $(".delay").val("");
        var ServiceUrl = $('#ServiceUrl').val();
        var f2j = formToJSON();
        var cnt = $('#lp').val();
        var cntvals = '';
        var errVal;
        var start = new Date().getTime();

        var ret = $.ajax({
            url: ServiceUrl+"api/v1/CCtor/" + $('#Id').val(),
            type: 'POST',
            contentType: 'application/json',
            dataType: "json",
            data: f2j,
            async: true,
            cache: false,
            timeout: 30000,
            error: function (xhr, ajaxOptions, thrownError) {
                $("#loader").hide();
                $(".Error2").val(xhr.status + " " + xhr.responseText);
                return false;
            },
            success: function (data, textStatus, jqXHR) {
                if (data.Cd == 0) {
                    var k2          = data.Ky;
                    var pb          = $("#Pb").val();
                    for (var i = 0; i < cnt; i++) {
                        $.ajax({
                            url: ServiceUrl+"api/v1/CCtor/" + $('#Id').val(),
                            type: 'PUT',
                            dataType: "json",
                            contentType: 'application/json',
                            data: formToJSON1(k2,pb),
                            async: false,
                            cache: false,
                            timeout: 30000,
                            error: function (xhr, ajaxOptions, thrownError) {
                                cntvals = cntvals + "[" + xhr.status + "-" + xhr.responseText+"]";
                                return false;
                            },
                            success: function (data, textStatus, jqXHR) {
                                if (data.Cd == 0) {
                                    cntvals = cntvals + '-' + data.Vl;
                                }
                                else
                                {
                                    errVal = "Status Ok but Error: " + data.Cd;
                                    cntvals = cntvals + "[" + "Status Ok but Error: " + data.Cd + "]";
                                    if (data.Cd == 42) // Key has timeout -> reload it
                                    {
                                        $.ajax({
                                            url: ServiceUrl+"api/v1/CCtor/" + $('#Id').val(),
                                            type: 'POST',
                                            contentType: 'application/json',
                                            dataType: "json",
                                            data: formToJSON2(k2),
                                            async: false,
                                            cache: false,
                                            timeout: 30000,
                                            error: function (xhr, ajaxOptions, thrownError) {
                                                cntvals = cntvals + "[ err reloading key" + xhr.status + "-" + xhr.responseText + "]";
                                                return false;
                                            },
                                            success: function (data, textStatus, jqXHR) {
                                                if (data.Cd == 0) {
                                                    k2 = data.Ky;
                                                    cntvals = cntvals + "[new key loaded]";
                                                    return true;
                                                }
                                            }
                                        });
                                    }
                                    
                                }
                                return true;
                            }
                        });
                    }
                }
                else {
                    errVal="Status Ok but Error: " + data.Cd;
                    cntvals = cntvals + "-Error1:" + data.Cde;
                }
                var delay = new Date().getTime() - start;
                $(".newValue2").text(cntvals);
                $(".Error2").val(errVal);
                $(".delay").val(delay + " ms");
                $("#loader").hide();
                return true;
            }
        });
    }),
    $(".btnReadLoop").on("click", function (event) {
        event.preventDefault();
        $("#loader").show(); /* work only in FF */
        $(".newValue2").text("");
        $(".Error2").val("");
        $(".delay").val("");
        var ServiceUrl = $('#ServiceUrl').val();
        var f2j = formToJSON();
        var cnt = $('#lp').val();
        var cntvals = '';
        var errVal;
        var start = new Date().getTime();

        var ret = $.ajax({
            url: ServiceUrl+"api/v1/CCtor/" + $('#Id').val(),
            type: 'POST',
            contentType: 'application/json',
            dataType: "json",
            data: f2j,
            async: true,
            cache: false,
            timeout: 30000,
            error: function (xhr, ajaxOptions, thrownError) {
                $("#loader").hide();
                $(".Error2").val(xhr.status + " " + xhr.responseText);
                return false;
            },
            success: function (data, textStatus, jqXHR) {
                if (data.Cd == 0) {
                    var k2 = data.Ky;
                    for (var i = 0; i < cnt; i++) {
                        $.ajax({
                            url: ServiceUrl+"api/v1/CCtor/" + $('#Id').val() + '?Ky=' + encodeURIComponent(k2),
                            contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                            async: false,
                            cache: false,
                            timeout: 30000,
                            error: function (xhr, ajaxOptions, thrownError) {
                                cntvals = cntvals + "[" + xhr.status + "-" + xhr.responseText + "]";
                                return false;
                            },
                            success: function (data, textStatus, jqXHR) {
                                if (data.Cd == 0) {
                                    cntvals = cntvals + '-' + data.Vl;
                                }
                                else {
                                    errVal = "Status Ok but Error: " + data.Cd;
                                    cntvals = cntvals + "[" + "Status Ok but Error: " + data.Cd + "]";
                                    if (data.Cd == 42) // Key has timeout -> reload it
                                    {
                                        $.ajax({
                                            url: ServiceUrl+"api/v1/CCtor/" + $('#Id').val(),
                                            type: 'POST',
                                            contentType: 'application/json',
                                            dataType: "json",
                                            data: formToJSON2(k2),
                                            async: false,
                                            cache: false,
                                            timeout: 30000,
                                            error: function (xhr, ajaxOptions, thrownError) {
                                                cntvals = cntvals + "[ err reloading key" + xhr.status + "-" + xhr.responseText + "]";
                                                return false;
                                            },
                                            success: function (data, textStatus, jqXHR) {
                                                if (data.Cd == 0) {
                                                    k2 = data.Ky;
                                                    cntvals = cntvals + "[new key loaded]";
                                                    return true;
                                                }
                                            }
                                        });
                                    }

                                }
                                return true;
                            }
                        });
                    }
                }
                else {
                    errVal = "Status Ok but Error: " + data.Cd;
                    cntvals = cntvals + "-Error1:" + data.Cde;
                }
                var delay = new Date().getTime() - start;
                $(".newValue2").text(cntvals);
                $(".Error2").val(errVal);
                $(".delay").val(delay + " ms");
                $("#loader").hide();
                return true;
            }
        });
    }),
    formToJSON = function () {
        return JSON.stringify({
            "Ky": $('#Ky').val(),
            "Dl": $('#Dl').val()
        });
    },
    formToJSON1 = function (strval,pbVal) {
        return JSON.stringify({
            "Ky": strval,
            "Pb": pbVal
        });
    },
    formToJSON2 = function (strval) {
        return JSON.stringify({
            "Ky": strval,
            "Dl": $('#Dl').val()
        });
    },
    formToJSON3 = function (strval) {
        return JSON.stringify({
            "Ky": strval
        });
    },
    formToJSON4 = function (strval) {
        return JSON.stringify({
            "Ky": strval,
            "St": $('#trace').is(":checked")
        });
    },
    $("#loader").hide();
});
