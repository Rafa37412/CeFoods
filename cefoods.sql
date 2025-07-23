-- Criação do Banco de Dados
CREATE DATABASE IF NOT EXISTS `cefoods` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `cefoods`;

-- --------------------------------------------------------

-- Estrutura da tabela `categories`
-- Usamos um ID de texto para corresponder à lógica do frontend (ex: 'burgers', 'pizzas')
CREATE TABLE `categories` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserindo dados na tabela `categories`
INSERT INTO `categories` (`id`, `name`) VALUES
('burgers', 'Hambúrgueres'),
('pizzas', 'Pizzas'),
('drinks', 'Bebidas'),
('desserts', 'Sobremesas');

-- --------------------------------------------------------

-- Estrutura da tabela `products`
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(2083) DEFAULT NULL,
  `category_id` varchar(50) DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT '4.5',
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserindo dados na tabela `products`
INSERT INTO `products` (`id`, `name`, `description`, `price`, `image_url`, `category_id`, `rating`) VALUES
(1, 'Cheeseburger Clássico', 'Pão, carne, queijo, alface, tomate e molho especial.', '25.50', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop', 'burgers', '4.7'),
(2, 'Burger Duplo Bacon', 'Dois hambúrgueres, dobro de queijo, muito bacon e pão brioche.', '32.00', 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=500&auto=format&fit=crop', 'burgers', '4.9'),
(3, 'Pizza de Calabresa', 'Molho de tomate, queijo mussarela e calabresa fatiada.', '45.00', 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=500&auto=format&fit=crop', 'pizzas', '4.6'),
(4, 'Pizza Quatro Queijos', 'Mussarela, provolone, parmesão e gorgonzola.', '52.90', 'https://images.unsplash.com/photo-1571066811602-716837d681de?w=500&auto=format&fit=crop', 'pizzas', '4.8'),
(5, 'Coca-Cola Lata', 'Lata de 350ml, gelada.', '5.00', 'https://images.unsplash.com/photo-1622483767028-3f66f32a2ea7?w=500&auto=format&fit=crop', 'drinks', '5.0'),
(6, 'Suco de Laranja Natural', 'Copo de 500ml, feito na hora.', '8.00', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&auto=format&fit=crop', 'drinks', '4.9'),
(7, 'Pudim de Leite', 'A sobremesa clássica que todo mundo ama.', '9.50', 'https://images.unsplash.com/photo-1586985289936-a8a735945913?w=500&auto=format&fit=crop', 'desserts', '4.8'),
(8, 'Brownie com Sorvete', 'Brownie de chocolate quente com uma bola de sorvete de creme.', '18.00', 'https://images.unsplash.com/photo-1610325324036-5b4536a9d6a7?w=500&auto=format&fit=crop', 'desserts', '4.9');

-- --------------------------------------------------------

-- Estrutura da tabela `users`
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserindo um usuário de exemplo
-- IMPORTANTE: Em uma aplicação real, a senha NUNCA deve ser armazenada em texto plano.
-- Use bibliotecas como bcrypt para gerar um hash da senha antes de salvar.
INSERT INTO `users` (`id`, `name`, `email`, `password`) VALUES
(1, 'Usuário Teste', 'teste@email.com', '123456');

-- --------------------------------------------------------

-- Adicionando as chaves estrangeiras
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT;
