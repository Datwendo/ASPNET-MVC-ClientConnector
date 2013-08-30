/* CS Call Connector Blob  */
jQuery(function ($){
    var handleDrop = function (evt) {
        evt.originalEvent.stopPropagation();
        evt.originalEvent.preventDefault();
        $(this).removeClass('in hover');
        var files = evt.originalEvent.dataTransfer.files;
        SendFiles(files);
        $(this).removeClass('in hover');
    },
    SendFiles = function(files)
    {
        if (files.length > 0) {
            if (window.FormData !== undefined) {
                $(".Error1").val("");
                $(".newValue").val("");
                $("#loader").show();
                var ServiceUrl = $('#ServiceUrl').val();
                var start = new Date().getTime();
                var f2j = formToJSON();
                $.ajax({
                    url: ServiceUrl+"api/v1/CCtor/" + $('#Id').val(),
                    type: 'POST',
                    dataType: "json",
                    contentType: 'application/json',
                    data: f2j,
                    error: function (xhr, ajaxOptions, thrownError) {
                        $(".Error1").val(xhr.status + " " + xhr.responseText);                
                        $("#loader").hide();
                        return false;
                    },
                    success: function (data, textStatus, jqXHR) {
                        $(".newSecret").val(data.Ky);
                        var k2          = data.Ky;
                        var pb          = $("#Pb").val();
                        if (data.Cd == 0) {
                            var data = new FormData();
                            for (i = 0; i < files.length; i++) {
                                data.append("file" + i, files[i]);
                            }

                            $.ajax({
                                type: "POST",
                                url: ServiceUrl+"api/v1/BlobCCtor/" + $('#Id').val() + '?Pb='+pb+'&Ky=' + encodeURIComponent(k2),
                                contentType: false,
                                processData: false,
                                data: data,
                                error: function (xhr, ajaxOptions, thrownError) {
                                    $(".Error1").val(xhr.status + " " + xhr.responseText);
                                    $("#loader").hide();
                                    return false;
                                },
                                success: function (data, textStatus, jqXHR) {
                                    if (data.Cd != 0) {
                                        $(".Error1").val("Status Ok but Error: " + data.Cd);
                                    }
                                    var items = [];
                                    var Lst = data.Lst;
                                    var fnd = false;
                                    $(Lst).each(function (index, item) {
                                        var sz = (item.Size / 1024).toFixed(2);
                                        if (!fnd) {
                                            fnd = true;
                                            $('#Idx').val(item.CounterVal);
                                        }
                                        items.push('<li> ' + item.ImgIdx + "- <a target='blank' href='" + item.Path + "' type='" + item.ContentType + "' >" + item.Filename + '</a> Size: ' + sz + ' Kb</li>');
                                    });
                                    var delay = new Date().getTime() - start;
                                    items.push('<li>Delay ' + delay + ' ms</li>');
                                    $('#uploadResult').append.apply($('#uploadResult'), items);
                                    $("#loader").hide();
                                }
                            });                
                        }
                        else {
                            $(".Error1").val("Status Ok but Error: " + data.Cd);
                        }

                    }
                });                            

            } else {
                alert("your browser is not Html5 compatible!");
            }
        }
        $(this).removeClass('in hover');
    },

    handleDragOver = function (e) {
        e.originalEvent.stopPropagation();
        e.originalEvent.preventDefault();
        $(this).addClass('in hover');
    },

    handleDragLeave = function (e) {
        $(this).removeClass('in hover');
    },
    formToJSON3 = function (strval) {
        return JSON.stringify({
            "Ky": strval,
            "St": $('.ContentSt').val()
        });
    },
    formToJSON = function () {
        return JSON.stringify({
            "Ky": $('#Ky').val(),
            "Dl": $('#Dl').val()
        });
    };
    $(".btnSend").on("click", function (event) {
        event.preventDefault();
        var files = $('#files')[0].files;
        SendFiles(files);
    });
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
                        url: ServiceUrl+"api/v1/BlobCCtor/" + $('#Id').val() + '?Ix=' + $('#Idx').val() + '&Ky=' + encodeURIComponent(k2),
                        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                        error: function (xhr, ajaxOptions, thrownError) {
                            $("#loader").hide();
                            $(".Error1").val(xhr.status + " " + xhr.responseText);
                            return false;
                        },
                        success: function (data, textStatus, jqXHR) {
                            if (data.Cd == 0) {
                                var items = [];
                                var Lst = data.Lst;
                                $(Lst).each(function (index, item) {
                                    var sz = (item.Size / 1024).toFixed(2);
                                    items.push('<li>' + item.ImgIdx + "- <a target='blank' href='" + item.Path + "' type='" + item.ContentType+"' >" + item.Filename + '</a> Size: ' + sz + ' Kb</li>');
                                });
                                $('#uploadResult').append.apply($('#uploadResult'), items);
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
    });
   
    $(".btnClear").on('click', function (event) {
        $('#uploadResult').empty();
        return false;
    });
    $('#dropzone').bind('drop', handleDrop);
    $('#dropzone').bind('dragover', handleDragOver);
    $('#dropzone').bind('dragleave', handleDragLeave);
    $("#loader").hide();
});
