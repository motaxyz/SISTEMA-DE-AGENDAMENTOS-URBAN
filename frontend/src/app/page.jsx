'use client'

import Image from "next/image"; // Importação do componente Image do Next.js para otimização de imagens.
import Link from "next/link"; // Importação do Link para navegação entre páginas no Next.js.
import styles from "./page.module.css"; // Importação do arquivo CSS que contém os estilos para a página.

import Header from "@/components/header"; // Importação do componente Header para a seção de navegação do site.
import Footer from "@/components/footer"; // Importação do componente Footer para o rodapé da página.

import CarrosselInicial from "@/components/carrosselPage"; // Importação do carrossel para a parte inicial da página.
import CarrosselMobile from "@/components/carrosselMobile"; // Importação do carrossel para dispositivos móveis.
import CarrosselMobileMedium from "@/components/carrosselMobileMedium"; // Importação do carrossel para dispositivos móveis de tamanho médio.
import CarrosselEquipe from "@/components/carrosselEquipe"; // Importação do carrossel para exibir a equipe.
import CarrosselEquipeMobile from "@/components/carrosselEquipeMobile"; // Importação do carrossel para a equipe em dispositivos móveis.

export default function Home() {
    return (
        <html> {/* Início do elemento HTML principal */}
            <body> {/* Corpo da página */}
                <Header /> {/* Cabeçalho da página, geralmente contém o menu de navegação */}

                <section className={styles.section}> {/* Seção principal da página com o carrossel e o texto inicial */}

                    <div className={styles.carrosselInicial}> {/* Carrossel exibido na versão desktop */}
                        <CarrosselInicial /> {/* Componente do carrossel principal */}
                    </div>
                    <div className={styles.carrosselMobile}> {/* Carrossel exibido em dispositivos móveis */}
                        <CarrosselMobile /> {/* Componente do carrossel para mobile */}
                    </div>
                    <div className={styles.CarrosselMobileMedium}> {/* Carrossel exibido em dispositivos móveis de médio porte */}
                        <CarrosselMobileMedium /> {/* Componente do carrossel para dispositivos móveis de tamanho médio */}
                    </div>

                    <div className={styles.backgroundSection}> {/* Seção com fundo para título e descrição */}
                        <h2 className={styles.sectionTitle1}>Seu carro na melhor performance!</h2> {/* Título da seção */}
                        <p className={styles.sectionContent1}>Revele a essência do seu automóvel</p> {/* Descrição da seção */}
                    </div>
                </section>

                <main className={styles.main}> {/* Seção principal do conteúdo da página */}

                    <div className={styles.divider}></div> {/* Divisor entre as seções */}

                    <section className={styles.section2}> {/* Seção sobre os serviços oferecidos */}
                        <div className={styles.section2Image}> {/* Div que contém a imagem dos serviços */}
                            <Image
                                src='/servicomecanico1233.png' // Caminho para a imagem
                                alt="Imagem de serviço" // Texto alternativo para a imagem
                                width={500} // Largura da imagem
                                height={520} // Altura da imagem
                                className={styles.imagememsi} // Classe CSS aplicada à imagem
                            />
                        </div>
                        <div className={styles.section2Content}> {/* Conteúdo da seção de serviços */}
                            <h2 className={styles.section2Title}>Nossos Serviços</h2> {/* Título dos serviços */}
                            <p className={styles.section2Description}> {/* Descrição dos serviços */}
                                Oferecemos uma ampla gama de serviços para garantir que seu veículo esteja sempre em ótimo estado.
                                Desde manutenção preventiva até reparos complexos, temos a expertise que você precisa.
                            </p>
                            <div>
                                <Link href="/telas/servicos"> {/* Link para a página de serviços */}
                                    <button className={styles.section2Button}>Veja mais</button> {/* Botão para ver mais serviços */}
                                </Link>
                            </div>
                        </div>
                    </section>

                    <div className={styles.divider}></div> {/* Outro divisor */}

                    <section className={styles.secao3}> {/* Seção sobre a equipe */}
                        <div className={styles.carrouselEquipe}> {/* Carrossel da equipe */}
                            <CarrosselEquipe /> {/* Exibe os membros da equipe */}
                        </div>
                        <div className={styles.carrouselEquipeMobile}> {/* Carrossel da equipe para dispositivos móveis */}
                            <CarrosselEquipeMobile /> {/* Exibe os membros da equipe em dispositivos móveis */}
                        </div>
                    </section>

                    <div className={styles.divider}></div> {/* Divisor entre as seções */}

                    <section className={styles.section4}> {/* Seção de perguntas frequentes */}
                        <p className={styles.title_questions}>Perguntas frequentes</p> {/* Título da seção de perguntas */}
                        <div className={styles.container_questions}> {/* Contêiner que segura as perguntas */}

                            {/* Cada bloco de 'details' é uma pergunta com uma resposta expandível */}
                            <details className={styles.details}> 
                                <summary className={styles.summary}> {/* Título da pergunta */}
                                    <div className={styles.summary_content}>
                                        Preciso agendar um horário para realizar serviços de estética no meu veículo?
                                    </div>
                                    <div className={styles.boxArrow}> {/* Ícone da seta */}
                                        <span className={styles.arrow_down}></span> {/* Seta para expandir a resposta */}
                                    </div>
                                </summary>
                                <div className={styles.description}>
                                    Sim, recomendamos que você agende um horário para garantir que possamos atender seu veículo no melhor momento para você. Entre em contato pelo telefone, site ou aplicativo para agendar.
                                </div>
                            </details>

                            <details className={styles.details}>
                                <summary className={styles.summary}>
                                    <div className={styles.summary_content}>
                                        Quanto tempo leva para realizar um polimento completo no veículo?
                                    </div>
                                    <div className={styles.boxArrow}>
                                        <span className={styles.arrow_down}></span>
                                    </div>
                                </summary>
                                <div className={styles.description}>
                                    O tempo necessário para realizar um polimento completo pode variar dependendo do estado do veículo e do tipo de acabamento desejado. Em média, o processo leva de 3 a 5 horas.
                                </div>
                            </details>

                            <details className={styles.details}>
                                <summary className={styles.summary}>
                                    <div className={styles.summary_content}>
                                        Quais tipos de serviços de estética automotiva vocês realizam?
                                    </div>
                                    <div className={styles.boxArrow}>
                                        <span className={styles.arrow_down}></span>
                                    </div>
                                </summary>
                                <div className={styles.description}>
                                    Realizamos uma variedade de serviços de estética automotiva, como lavagem, polimento, enceramento, vitrificação, higienização interna, proteção de pintura, entre outros. Garantimos que seu carro estará sempre com a melhor aparência.
                                </div>
                            </details>

                            <details className={styles.details}>
                                <summary className={styles.summary}>
                                    <div className={styles.summary_content}>
                                        Quais formas de pagamento são aceitas?
                                    </div>
                                    <div className={styles.boxArrow}>
                                        <span className={styles.arrow_down}></span>
                                    </div>
                                </summary>
                                <div className={styles.description}>
                                    Aceitamos pagamentos em dinheiro, cartões de crédito e débito, e transferência bancária. Também trabalhamos com algumas opções de parcelamento, consulte nossa equipe para mais detalhes.
                                </div>
                            </details>

                            <details className={styles.details}>
                                <summary className={styles.summary}>
                                    <div className={styles.summary_content}>
                                        Vocês oferecem serviços de proteção de pintura?
                                    </div>
                                    <div className={styles.boxArrow}>
                                        <span className={styles.arrow_down}></span>
                                    </div>
                                </summary>
                                <div className={styles.description}>
                                    Sim, oferecemos diversos tipos de proteção de pintura, incluindo vitrificação, aplicação de cera e selante. Esses serviços ajudam a preservar a cor e o brilho do seu veículo por mais tempo.
                                </div>
                            </details>

                            <details className={styles.details}>
                                <summary className={styles.summary}>
                                    <div className={styles.summary_content}>
                                        Como posso agendar um serviço de estética automotiva?
                                    </div>
                                    <div className={styles.boxArrow}>
                                        <span className={styles.arrow_down}></span>
                                    </div>
                                </summary>
                                <div className={styles.description}>
                                    Para agendar um serviço de estética automotiva, entre em contato conosco por telefone, ou acesse nosso site ou aplicativo. Nossa equipe estará pronta para ajudar a escolher o melhor horário para você.
                                </div>
                            </details>

                            <details className={styles.details}>
                                <summary className={styles.summary}>
                                    <div className={styles.summary_content}>
                                        Qual é a frequência recomendada para serviços de lavagem e manutenção estética?
                                    </div>
                                    <div className={styles.boxArrow}>
                                        <span className={styles.arrow_down}></span>
                                    </div>
                                </summary>
                                <div className={styles.description}>
                                    Recomendamos realizar a lavagem e manutenção estética do veículo pelo menos uma vez por mês para manter a pintura e o interior em excelente estado. A frequência pode variar conforme o uso e as condições ambientais.
                                </div>
                            </details>

                            <details className={styles.details}>
                                <summary className={styles.summary}>
                                    <div className={styles.summary_content}>
                                        Qual é o horário de funcionamento da oficina?
                                    </div>
                                    <div className={styles.boxArrow}>
                                        <span className={styles.arrow_down}></span>
                                    </div>
                                </summary>
                                <div className={styles.description}>
                                    Nossa oficina funciona de segunda a sexta, das 8h às 18h, e aos sábados das 8h às 13h. Não abrimos aos domingos e feriados.
                                </div>
                            </details>
                        </div>
                    </section>

                </main>

                <Footer />

            </body>
        </html >
    );
}
