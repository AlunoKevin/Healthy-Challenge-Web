CREATE TABLE Usuario(

	ID_Usuario 	  NUMERIC(5)   NOT NULL,
	Nome       	  VARCHAR(100) NOT NULL,
	Email      	  VARCHAR(150) NOT NULL,
	Nivel_Dificuldade CHAR (1)     NOT NULL,
	Ultimo_Acesso	  DATE	       NOT NULL,
	Data_Cadastro	  DATE	       NOT NULL,
	Dias_Consecutivos INT	       NOT NULL,
	Senha_Hash	  VARCHAR(25)  NOT NULL,
	
	CONSTRAINT pk_usr PRIMARY KEY (ID_Usuario)
);

CREATE TABLE Liga (

	ID_Liga		  NUMERIC(5)   NOT NULL,
	Liga		  INT	       NOT NULL,
	Descricao	  VARCHAR(60)  NOT NULL,
	Nome		  VARCHAR(30)          ,
	
	CONSTRAINT pk_Liga PRIMARY KER (ID_Liga)




);

CREATE TABLE Historico_De_Atividades (






);


CREATE TABLE Habito (






);




CREATE TABLE Adiministrador (





);



CREATE TABLE Conclusao_Desafio (






);


CREATE TABLE Desafio (






);


CREATE TABLE Jogo (





);
