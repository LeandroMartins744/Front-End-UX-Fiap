import {NextPage} from "next";
import {useState} from "react";
import {executeRequest} from "../services/api";
import {ModalSuccess} from "../components/Modal";

type RegisterProp = {
    setRegisterShow(isShow: boolean): void
}

export const Register: NextPage<RegisterProp> = ({ setRegisterShow }) => {
    const [error, setError] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConformPassword] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const closeModal = () => {
        setShowModal(false)
        setRegisterShow(false)
    }

    const goLogin = () => { setRegisterShow(false) }

    const doRegister = async () => {
        setError('')
        setShowModal(false)
        try {
            if (!name || !email || !password || !confirmPassword) {
                setError('Todos os campos devem ser preenchidos');
                return;
            }
            if (password.length < 6) {
                setError("Senha deve conter pelo menos 6 caracteres.")
                return;
            }
            if (password != confirmPassword) {
                setError("A senhas não estão iguais")
                return;
            }

            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if(!re.test(String(email).toLowerCase())){
                setError("Email inválido")
                return;
            }

            setIsLoading(true)
            const client = { name, email, password }
            const result = await executeRequest('user', 'POST', client);
            setIsLoading(false)

            if (result && result.data)
                setShowModal(true)
        }
        catch (e: any) {
            if (e?.response?.data?.error) {
                console.log(e?.response);
                setError(e?.response?.data?.error);
                return;
            }
            console.log(e);
            setError('Ocorreu erro ao efetuar o registo do usuário, tente novamenete');
        }
    }

    return (
        <>
            <div className="form">
                {error && <p>{error}</p>}

                <div className="input">
                    <img src="/name.svg" alt="Digite o seu nome"/>
                    <input type="text"
                           placeholder="Digite o seu nome"
                           value={name}
                           onChange={event => setName(event.target.value)}
                    />
                </div>

                <div className="input">
                    <img src="/mail.svg" alt="Digite o seu email"/>
                    <input type="text"
                           placeholder="Digite o seu email"
                           value={email}
                           onChange={event => setEmail(event.target.value)}
                    />
                </div>
                <div className="input">
                    <img src="/lock.svg" alt="Digite o sua senha"/>
                    <input type="password"
                           placeholder="Digite o sua senha"
                           value={password}
                           onChange={event => setPassword(event.target.value)}
                    />
                </div>
                <div className="input">
                    <img src="/lock.svg" alt="Confirme a sua senha"/>
                    <input type="password"
                           placeholder="Confirme a sua senha"
                           value={confirmPassword}
                           onChange={event => setConformPassword(event.target.value)}
                    />
                </div>
                <button onClick={doRegister}>Register</button>
                <button onClick={goLogin}>Volta para Login</button>
            </div>
            <ModalSuccess
                isShow={showModal}
                title={"cadastro"}
                message={"Usuário criado com sucesso!!"}
                isLoaderShow={isLoading}
                closeModal={closeModal}
            />
        </>
    );
}

