--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5beta2
-- Dumped by pg_dump version 9.5beta2

-- Started on 2016-06-14 15:55:31

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 181 (class 1259 OID 17482)
-- Name: items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE items (
    category text,
    price money,
    stocked boolean,
    name text,
    id integer NOT NULL
);


ALTER TABLE items OWNER TO postgres;

--
-- TOC entry 182 (class 1259 OID 17488)
-- Name: items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE items_id_seq OWNER TO postgres;

--
-- TOC entry 2108 (class 0 OID 0)
-- Dependencies: 182
-- Name: items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE items_id_seq OWNED BY items.id;


--
-- TOC entry 1985 (class 2604 OID 17490)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY items ALTER COLUMN id SET DEFAULT nextval('items_id_seq'::regclass);


--
-- TOC entry 2102 (class 0 OID 17482)
-- Dependencies: 181
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY items (category, price, stocked, name, id) FROM stdin;
Sporting Goods	$49.99	t	Football	2
Sporting Goods	$9.99	t	Baseball	3
Sporting Goods	$29.99	f	Basketball	4
Electronics	$99.99	t	iPod Touch	5
Electronics	$399.99	f	iPhone 5	6
Electronics	$199.99	t	Nexus 7	7
\.


--
-- TOC entry 2109 (class 0 OID 0)
-- Dependencies: 182
-- Name: items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('items_id_seq', 7, true);


--
-- TOC entry 1987 (class 2606 OID 17498)
-- Name: items_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY items
    ADD CONSTRAINT items_pk PRIMARY KEY (id);


-- Completed on 2016-06-14 15:55:31

--
-- PostgreSQL database dump complete
--

