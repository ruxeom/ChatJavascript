function changeFont() {
    Text = Text.replace(new RegExp("\\*\\*(.+?)\\*\\*", "g"), '<strong>$1</strong>');
}