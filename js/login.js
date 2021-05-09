$(document).ready(function() {
    $("#btnLogin").click(function() {
        let $user = $("#user").val();
        let $pwd = $("#pwd").val();
        if ($user && $pwd) {
            $.getJSON("http://localhost:8080/user", function($registros) {


                if ($registros.filter($usuario => $usuario.username == $user && $usuario.pwd == $pwd).length > 0) {
                    let $teste = $registros.filter($usuario => $usuario.username == $user)
                    let $id = $teste[0].id
                    sessionStorage.setItem('id', $id);
                    sessionStorage.setItem('username', $user);
                    window.open("index.html", "_self");
                } else
                    alert("Usuário ou senha incorretos, tente novamente ou cadastre-se!")
            });
        } else
            alert("Digite o usuário e a senha!");

    });
});