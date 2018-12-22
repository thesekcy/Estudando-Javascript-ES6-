import api from './api'; //Importando a api do api.js, como tem o import default vem por padrão a api

//criando uma classe denominada de app
class App {

    //setando um construtor que irá gerar por padrão uma estrutura
    constructor() {
        this.repositories = []; // criando e zerando o array

        //declarando os elemetnos HTML
        this.formEl = document.getElementById('repo-form'); 
        this.inputEl = document.querySelector('input[name=repository]');
        this.listEl = document.getElementById('repo-list');

        //Chamando uma função
        this.registerHandlers();
    }

    //Criando a função
    registerHandlers() {

        //Quando o FormEl tiver a ação de submit ele executa o evento de adicionar um repositório
        //O addRepository é uma função que está abaixo.
        this.formEl.onsubmit = event => this.addRepository(event);
    }

    //Fazendo função de loading.
    setLoading(loading = true){ //setando o parametro loading como true por padrão
        if(loading === true){ // Checando se o valor é true
            let loadingEl = document.createElement('span'); // declarando elemento local
            loadingEl.appendChild(document.createTextNode('Carregando')); //adicionando um texto ao elemento
            loadingEl.setAttribute('id', 'loading'); // adicionando um atributo ao elemento no caso id="loading"

            this.formEl.appendChild(loadingEl); // jogando o loading dentro do formulário HTML
        }else{ //caso sejá false o loading
            document.getElementById('loading').remove(); // remove o elemento com id="loading"
        }
    }

    //Criando uma função async, onde a função executa enquanto o usuário pode navegar na plataforma
    //O site não trava ou da tela de loading, o carregamento acontece por trás da interface.
    async addRepository(event) {
        event.preventDefault(); //Previnindo que o event tenha comportamentos HTML padrões (onde o event seria o evento realizado quando clicar o botão adicionar.)

        const repoInput = this.inputEl.value; //pegando o valor do input e jogando dentro da constante

        if (repoInput.lenght === "") //Checando se o campo está vazio, caso estiver
            return; //o return deve dar um break na função (mas aparentemente não está acontecendo isso).

            this.setLoading(); //Chamando a função de loading tendo true como padrão.

        try { //Tratativa de erro com try catch

            //criando uma constante que retornará os dados a api
            //o /repos está passando o restante do caminho já definido em api.js, onde /repos irá procurar repositorios e /users usuários,
            // e está chamando o nome do repositório dado no input
            const response = await api.get(`/repos/${repoInput}`); 
    
            //Constante que está quebrando o JSON de dados trazendo as informações
            //Name, description e html_url estão na "raiz", portanto podem ser chamada diretamente, o avatar_url está dentro de owner por isso tem a sua declaração como owner:{nome_do_campo}
            const { name, description, html_url, owner: { avatar_url } } = response.data; // e as informações vão ser tiradas do campo data que está dentro da constante response.

            this.repositories.push({ //puxa os campos disponiveis no array e joga as informações dentro deles. (as informações dos campos são puaxadas na função "render").
                name,
                description,
                avatar_url,
                html_url,
            });

            //limpando o input depois do professo realizado.
            this.inputEl.value = '';
           
            //renderizando as informações na tela chamando a função apropriada.
            this.render();

            
            
        } catch (error) { // caso de erro no try
            //exibe um alerta de repositório inexistente e limpa o input
            alert('Repositório inexistente.');
            this.inputEl.value = '';
        }

        //seta o loading como false para que ele será removido da tela.
        this.setLoading(false);
    }

    //função render, que exibe os elementos HTML na tela.
    render() {
        //Limpa tudo que tá dentro da lista.
        this.listEl.innerHTML = '';

        //roda um ForEach que percorre todo o array e exibe as informações.


        //createElement cria os elementos (img, p, strong, a) html.
        //setAttribute setá um atributo que vai no elemento e seu dado exemplo: ('id', 'teste'), sendo o elemento final um "A" ficará assim: <a id="teste">
        //appendChield aloca um elemento dentro do outro como filho 

        this.repositories.forEach(repo => {
            let imgEl = document.createElement('img');
            imgEl.setAttribute('src', repo.avatar_url);

            let titleEl = document.createElement('strong');
            titleEl.appendChild(document.createTextNode(repo.name));

            let descriptionEl = document.createElement('p');
            descriptionEl.appendChild(document.createTextNode(repo.description));

            let linkEl = document.createElement('a');
            linkEl.setAttribute('target', '_blank')
            linkEl.setAttribute('href', repo.html_url);
            linkEl.appendChild(document.createTextNode("Acessar"));

            let listItemEl = document.createElement('li');
            listItemEl.appendChild(imgEl);
            listItemEl.appendChild(titleEl);
            listItemEl.appendChild(descriptionEl);
            listItemEl.appendChild(linkEl);

            this.listEl.appendChild(listItemEl);

        });
    }
}

new App();