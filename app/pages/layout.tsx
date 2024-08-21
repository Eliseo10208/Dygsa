// pages/layout.tsx
"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import "@/app/assets/css/Styles.css";
import "@/app/assets/css/checkbox.css";
import Link from "next/link";
import ClientesPanel from "../pages/clients/page";
import ViajesPanel from "../pages/viajes/page";
import Image from "next/image";
import logo2 from "@/app/assets/img/logo2.png";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHome,
    faTruck,
    faIdCard,
    faUsers,
    faScrewdriver,
    faBars,
    faCaretDown, 
    faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";
import { signOut } from "next-auth/react";
type SessionUser = {
    name?: string;
    email?: string;
    image?: string;
    rol?: string;
};
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data: session, status } = useSession();
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const router = useRouter();
    const handleMenuClick = (menu: string) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };
    const userRol = (session?.user as SessionUser)?.rol
    if (status === "loading") return <div>Cargando...</div>;
    if (status === "unauthenticated") return <div>No autenticado</div>;
    
    return (
        <div className="control-container">
            <div className="control-nav">
                <div className="logo">
                    <Image src={logo2} alt="nada" width={200} height={100} />
                </div>
                <div className="nav-group">
                    <div>
                        <FontAwesomeIcon icon={faHome} />
                        <div
                            className="nav-txt"
                            onClick={() => router.push("/pages/viajes")}
                        >
                            Registro de viaje
                        </div>
                    </div>
                </div>
                <div className="nav-group">
                    <div
                        className=""
                        onClick={() => handleMenuClick("unidades")}
                    >
                        <FontAwesomeIcon icon={faTruck} />
                        <div className="nav-txt">Unidades</div>
                    </div>
                    <ul
                        style={{
                            display: openMenu === "unidades" ? "block" : "none",
                        }}
                    >
                        <li
                            onClick={() =>
                                router.push("/pages/unidades/vehiculos")
                            }
                        >
                            Vehículos
                        </li>
                        <li
                            onClick={() =>
                                router.push("/pages/unidades/remolques")
                            }
                        >
                            Remolques
                        </li>
                        {/* <li
                            onClick={() =>
                                router.push("/pages/unidades/configuracion")
                            }
                        >
                            Configuración
                        </li> */}
                    </ul>
                </div>
                <div className="nav-group">
                    <div onClick={() => router.push("/pages/operadores")}>
                        <FontAwesomeIcon icon={faIdCard} />
                        <div className="nav-txt">Operadores</div>
                    </div>
                </div>
                <div
                    className="nav-group"
                    onClick={() => router.push("/pages/clients")}
                >
                    <div>
                        <FontAwesomeIcon icon={faUsers} />
                        <div className="nav-txt">Clientes</div>
                    </div>
                </div>
                {(userRol === "owner" || userRol === "admin") && (
                <div
                    className="nav-group"
                    onClick={() => router.push("/pages/administracion")}
                >
                    <div>
                        <FontAwesomeIcon icon={faScrewdriver} />
                            <div className="nav-txt">Administración</div>
                        </div>
                    </div>
                )}
                <div className="nav-group">
                    <div>
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        <div
                            className="nav-txt"
                            onClick={() => signOut({ callbackUrl: "/login" })}
                        >
                            Salir
                        </div>
                    </div>
                </div>
            </div>

            <div className="control-content">
                <div className="control-header">
                    <button className="nav-bar">
                      
                    </button>

                    <div className="control-user">
                        <button className="btn">
                            <Image src="/assets/img/photodefault.png" width={500} height={500} alt="nada" />{" "}
                            {session?.user?.name}{" "}
                            <FontAwesomeIcon icon={faCaretDown} />
                        </button>
                        <ul>
                            <li>Configuración</li>
                            <li>Salir</li>
                        </ul>
                    </div>
                </div>
                <div className="content">{children}</div>
            </div>
        </div>
    );
};

export default Layout;
