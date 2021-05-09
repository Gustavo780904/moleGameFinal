$(document).ready(function() {
    $("#btnLogin").click(function() {
        let $user = $("#user").val();
        let $pwd = $("#pwd").val();
        if ($user && $pwd) {
            $.getJSON("http://localhost:8080/user", function($registros) {

                let $teste = $registros.filter($usuario => $usuario.username == $user)
                let $id = $teste[0].id
                if ($registros.filter($usuario => $usuario.username == $user && $usuario.pwd == $pwd).length > 0) {
                    sessionStorage.setItem('id', $id);
                    window.open("index.html", "_self");
                } else
                    alert("Usuário ou senha incorretos, tente novamente ou cadastre-se!")
            });
        } else
            alert("Digite o usuário e a senha!");

    });
});