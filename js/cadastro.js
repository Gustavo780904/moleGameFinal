$(document).ready(function() {
    $("#btnCadastrar").click(function() {
        console.log("ok")
        let $user = $("#user").val();
        let $pwd = $("#pwd").val();
        let $pwdconf = $("#pwdconf").val();
        let data = { "username": $user, "pwd": $pwd }
        if ($user && $pwd && !$pwdconf)
            alert("Confirme sua senha!")
        else if ($user && !$pwd && $pwdconf)
            alert('Digite uma senha no campo "senha"')
        else if (!$user && $pwd && !$pwdconf)
            alert('Voce deve digitar um nome de usuário e uma senha')
        else if (!$user && $pwd && $pwdconf)
            alert('Voce deve digitar um nome de usuário')
        else if ($user && !$pwd && !$pwdconf)
            alert('Voce deve digitar uma senha e depois confirmá-la')
        else if (!$user && !$pwd && !$pwdconf)
            alert('Digite um nome de usuário, uma senha e depois confirme-a')
        else if ($user && $pwd && $pwdconf && $pwd == $pwdconf) {
            $.getJSON("http://localhost:8080/user", function($registros) {
                console.log($registros)
                if ($registros.filter($registros => $registros.username == $user && $registros.pwd == $pwd).length > 0)
                    alert("Usuário já cadastrado, tente outro nome de usuário!") //melhorar com reset de senha
                else
                    axios.post("http://localhost:8080/user", data, alerta());

                function alerta() {
                    alert("Cadastro realizado com sucesso");
                };

            });
        } else {
            alert("As senhas devem ser iguais");
        }
    });
});