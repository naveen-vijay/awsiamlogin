function awsAccountViewModel(account_name) {
    this.account_name = ko.observable(account_name);
    this.url = ko.computed(function () {
        return 'https://' + account_name + '.signin.aws.amazon.com/console';
    }, this);
    this.removeBookmark = function (account_name) {

        bookmarkList.remove(account_name);
        var b = JSON.parse(localStorage.bookmarkList);
        for (i = 0; i < b.length; i++) {
            if (this.account_name() == b[i].account_name) {
                break
            }
        }
        b.splice(i, 1);
        localStorage.bookmarkList = JSON.stringify(b);
    };
}

var bookmarkList = ko.observableArray();
ko.applyBindings(bookmarkList);

function local_storage_sync() {
    if (localStorage.bookmarkList == null) {
        //no bookmarks
    }
    else if (typeof localStorage.bookmarkList === 'undefined') {

    }
    else {
        var b = JSON.parse(localStorage.bookmarkList);
        $.each(b, function (item) {

            bookmarkList.push(new awsAccountViewModel(b[item].account_name));
        });
    }
}

function update_bookmark_list() {
    $('#aws-account-bookmarks').append('<a href="' + url + '" class="list-group-item text-center btn btn-warning" target="_blank">' + account_id + '</a>');
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
    if (account_id == '' || account_id == null) {
        alert('Account Id cant be blank');
        return;
    }

    b = null;
    if (typeof localStorage.bookmarkList === 'undefined') {
        b = []
    }
    else {
        b = JSON.parse(localStorage.bookmarkList);
    }

    found = false;
    for (i = 0; i < b.length; i++) {
        if (account_id == b[i].account_name) {
            found = true;
            break;
        }
    }

    if (!found) {
        b.push({"account_name": account_id});
        localStorage.bookmarkList = JSON.stringify(b);
        alert('Bookmark Added');
        $('#account-id').val(null);

        bookmarkList.push(new awsAccountViewModel(account_id));

    }
    else {
        alert('Bookmark Already Added');
    }


}

$('document').ready(function () {
    local_storage_sync();
    $("[data-toggle=tooltip]").tooltip();

    $('#go-btn').click(function () {
        navigate_aws_account();
    });

    $('#add-btn').click(function () {
        add_bookmark();
    });

    $('#account-id').keypress(function (e) {
        if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
            navigate_aws_account();
        }
    });
});