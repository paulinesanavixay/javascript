<?php

namespace App\DataFixtures;

use App\Entity\Article;
use App\Entity\Category;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Faker\Generator;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Serializer\SerializerInterface;

class AppFixtures extends Fixture
{
    private const USERS = [
        "tom@gmail.com" => "tommy1234",
        "bob@gmail.com" => "bobby1234",
        "will@gmail.com" => "willy1234",
        "bill@gmail.com" => "billy1234",
        "bryan@gmail.com" => "bryan1234",
    ];

    private array $dbUsers = [];
    private array $dbCategories = [];

    public function __construct(
        private SerializerInterface $serializer,
        private UserPasswordHasherInterface $hasher
    ) {
    }

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        $this->loadUsers($manager);
        $this->loadCategories($manager);
        $this->loadArticles($manager, $faker);

        $manager->flush();
    }

    private function loadUsers(ObjectManager $manager): void
    {
        $admin = new User();
        $admin
            ->setEmail("admin@hb-corp.com")
            ->setRoles(['ROLE_ADMIN'])
            ->setPassword($this->hasher->hashPassword($admin, "admin1234"));
        $manager->persist($admin);

        foreach (self::USERS as $email => $password) {
            $user = new User();
            $user
                ->setEmail($email)
                ->setPassword($this->hasher->hashPassword($user, $password));
            $manager->persist($user);
            $this->dbUsers[] = $user;
        }
    }

    /**
     * Charge les catégories du fichier categories.txt en BDD
     *
     * @param \Doctrine\Persistence\ObjectManager $manager
     * @return Category[] Les entités catégories créées en BDD
     */
    private function loadCategories(ObjectManager $manager): void
    {
        // Catégories
        $rawCategories = file(__DIR__ . '/categories.txt', );
        $categories = array_map(fn (string $cat) => trim($cat), $rawCategories);

        foreach ($categories as $categoryName) {
            $category = new Category();
            $category->setName($categoryName);

            $manager->persist($category);
            $this->dbCategories[] = $category;
        }
    }

    private function loadArticles(ObjectManager $manager, Generator $faker): void
    {
        $rawArticlesContent = file_get_contents(__DIR__ . '/articles.json');

        /** @var Article[] $articles */
        $articles = $this->serializer->deserialize($rawArticlesContent, Article::class . '[]', 'json');

        foreach ($articles as $article) {
            $article
                ->setCreatedAt(\DateTimeImmutable::createFromMutable($faker->dateTimeBetween('-3 years')))
                ->setVisible($faker->boolean(80))
                ->setCategory($faker->randomElement($this->dbCategories))
                ->setAuthor($faker->randomElement($this->dbUsers));

            $manager->persist($article);
        }
    }
}
