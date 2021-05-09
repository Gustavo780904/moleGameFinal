$(document).ready(function() {
    $("#btnLogin").click(function() {
        let $user = $("#user").val();
        let $pwd = $("#pwd").val();
        if ($user && $pwd) {
            $.getJSON("http://localhost:8080/user", function($registros) {
                console.log()
                if ($registros.filter($usuario => $usuario.username == $user && $usuario.pwd == $pwd).length > 0)
                    window.open("index.html", "_self");
                else
                    alert("Usuário ou senha incorretos, tente novamente ou cadastre-se!")
            });
        } else
            alert("Digite o usuário e a senha!");

    });
});