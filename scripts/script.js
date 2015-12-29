function awsAccountViewModel(bookmark) {
    this.account_name = ko.observable(bookmark.account_name)
    this.account_label = ko.observable(bookmark.account_label)
    this.url = ko.computed(function () {
        return 'https://' + this.account_name() + '.signin.aws.amazon.com/console';
    }, this)
    
    this.removeBookmark = function () {
        bookmarkList.remove(this)
        var list = JSON.parse(localStorage.bookmarkList)
        list = $.grep(list, function (item) {
            return item.account_name != bookmark.account_name
        })
        localStorage.bookmarkList = JSON.stringify(list)
    }
}

var bookmarkList = ko.observableArray();
ko.applyBindings(bookmarkList);

function local_storage_sync() {
    if (localStorage.bookmarkList) {
        var list = JSON.parse(localStorage.bookmarkList)
        $.each(list, function () {
            bookmarkList.push(new awsAccountViewModel(this))
        })
    }
}

function navigate_aws_account() {
    var account_id = $('#account-id').val();
    if (account_id == '' || account_id == null) {
        return;
    }
    var url = "https://" + account_id + ".signin.aws.amazon.com/console";
    var win = window.open(url, '_blank');
    if (win) {
        //Browser has allowed it to be opened
        win.focus();
    } else {
        //Broswer has blocked it
        alert('Please allow popups for this site');
    }
}

function add_bookmark() {
    var account_id = $('#account-id').val();
    var account_label = $("#account-label").val();
    if (account_id == '' || account_id == null) {
        alert('Account Id cant be blank');
        return;
    }
    
    // Keep "account_name" as id for backwards compat
    var bookmark = {
        account_name: account_id,
        account_label: account_label
    }
    
    // Save to local storage
    var list = []
    if (localStorage.bookmarkList) {
        list = JSON.parse(localStorage.bookmarkList)
    }
    list.push(bookmark)
    localStorage.bookmarkList = JSON.stringify(list)
    
    // Clear form
    $("#account-id").val("")
    $("#account-label").val("")
    
    // Display
    bookmarkList.push(new awsAccountViewModel(bookmark))
}

$.fn.keypressof = function (which, fn) {
    $(this).keypress(function (ev) {
        if (ev.which == which || ev.keyCode == which) fn();
    })
}

$(document).ready(function () {
    local_storage_sync();
    $("[data-toggle=tooltip]").tooltip();

    $('#go-btn').click(function () {
        navigate_aws_account();
    });

    $('#add-btn').click(function () {
        add_bookmark();
    });
    
    var ENTER = 13
    $("#account-id").keypressof(ENTER, navigate_aws_account)
    $("#account-label").keypressof(ENTER, add_bookmark)
});
