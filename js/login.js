$(document).ready(function() {
    $("#btnLogin").click(function() {
        let $user = $("#user").val();
        let $pwd = $("#pwd").val();
        if ($user && $pwd) {
            $.getJSON("../json/users.json", function($registros) {
                if ($registros.usuarios.filter($usuario => $usuario.user == $user && $usuario.pwd == $pwd).length > 0)
                    window.open("index.html", "_self");
                else
                    alert("Usuário ou senha incorretos, tente novamente ou cadastre-se!")
            });
        } else
            alert("Digite o usuário e a senha!");

    });
});