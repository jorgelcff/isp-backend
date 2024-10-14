import psycopg2
import pandas as pd

DB_HOST = "dpg-cs6b4sl6l47c73fbp1hg-a.virginia-postgres.render.com"
DB_PORT = "5432"
DB_NAME = "isp_es4r"
DB_USER = "jorge"
DB_PASS = "pagA0cpScWRPdhkU2dGnd1CJQxnRM6x9"


def connect_db():
    try:
        conn = psycopg2.connect(
            host=DB_HOST, port=DB_PORT, database=DB_NAME, user=DB_USER, password=DB_PASS
        )
        return conn
    except Exception as e:
        print(f"Erro ao conectar ao banco de dados: {e}")
        return None


def normalize_csv(file_path):
    try:
        # Substitui a vírgula por ponto para números decimais e carrega o CSV
        df = pd.read_csv(
            file_path, sep=";", decimal=",", encoding="utf-8", quotechar='"'
        )

        # Substitui valores NaN por None (para tratamento de NULL no SQL)
        df = df.fillna(0)

        # Converte valores numéricos com '.0' para inteiros
        return df
    except Exception as e:
        print(f"Erro ao normalizar CSV: {e}")
        return None


def cretate_table_armas():
    try:
        conn = connect_db()
        if conn is None:
            return

        cursor = conn.cursor()

        cursor.execute(
            """
            CREATE TABLE armaapreendida(
            id SERIAL PRIMARY KEY,
            cisp VARCHAR(10) NOT NULL,
            mes INT NOT NULL CHECK (mes BETWEEN 1 AND 12),
            ano INT NOT NULL CHECK (ano > 0),
            aisp VARCHAR(10) NOT NULL,
            risp VARCHAR(10) NOT NULL,
            arma_fogo_arma_fabricacao_caseira INT DEFAULT 0,
            arma_fogo_carabina INT DEFAULT 0,
            arma_fogo_espingarda INT DEFAULT 0,
            arma_fogo_fuzil INT DEFAULT 0,
            arma_fogo_garrucha INT DEFAULT 0,
            arma_fogo_garruchao INT DEFAULT 0,
            arma_fogo_metralhadora INT DEFAULT 0,
            arma_fogo_outros INT DEFAULT 0,
            arma_fogo_pistola INT DEFAULT 0,
            arma_fogo_revolver INT DEFAULT 0,
            arma_fogo_submetralhadora INT DEFAULT 0,
            arma_fogo_total INT DEFAULT 0,
            arma_branca_total INT DEFAULT 0,
            artefato_explosivo_armadilha_explosiva INT DEFAULT 0,
            artefato_explosivo_armadilha_incendiaria INT DEFAULT 0,
            artefato_explosivo_bomba_fabricacao_caseira INT DEFAULT 0,
            artefato_explosivo_granada INT DEFAULT 0,
            artefato_explosivo_material_belico_explosivo INT DEFAULT 0,
            artefato_explosivo_material_explosivo INT DEFAULT 0,
            artefato_explosivo_material_explosivo_caseiro INT DEFAULT 0,
            artefato_explosivo_material_nao_identificado INT DEFAULT 0,
            artefato_explosivo_total INT DEFAULT 0,
            municao_total INT DEFAULT 0,
            simulacro_airsoft INT DEFAULT 0,
            simulacro_arma_fabricacao_caseira INT DEFAULT 0,
            simulacro_carabina INT DEFAULT 0,
            simulacro_espingarda INT DEFAULT 0,
            simulacro_fuzil INT DEFAULT 0,
            simulacro_garrucha INT DEFAULT 0,
            simulacro_garruchao INT DEFAULT 0,
            simulacro_metralhadora INT DEFAULT 0,
            simulacro_outros INT DEFAULT 0,
            simulacro_paintball INT DEFAULT 0,
            simulacro_pistola INT DEFAULT 0,
            simulacro_revolver INT DEFAULT 0,
            simulacro_submetralhadora INT DEFAULT 0,
            simulacro_total INT DEFAULT 0)
            """
        )
        conn.commit()
        print("Tabela de armas apreendidas criada com sucesso!")
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Erro ao normalizar CSV: {e}")
        return None


def cretate_table_areas_regiao():
    try:
        conn = connect_db()
        if conn is None:
            return

        cursor = conn.cursor()

        cursor.execute(
            """
            CREATE TABLE arearegiao (
                id SERIAL PRIMARY KEY,
                cisp VARCHAR(10) NOT NULL,
                aisp VARCHAR(10) NOT NULL,
                risp VARCHAR(10) NOT NULL,
                area_cisp_km2 DECIMAL(10, 2) DEFAULT 0.00,
                area_aisp_km2 DECIMAL(10, 2) DEFAULT 0.00,
                area_risp_km2 DECIMAL(10, 2) DEFAULT 0.00
                )
            """
        )

        conn.commit()
        print("Tabela de áreas criada com sucesso!")
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Erro ao criar tabela de áreas: {e}")


def upload_areas_regiao(csv_file):
    try:
        conn = connect_db()
        if conn is None:
            return

        cursor = conn.cursor()

        df = normalize_csv(csv_file)

        for index, row in df.iterrows():
            cursor.execute(
                """
                INSERT INTO arearegiao (cisp, aisp, risp, area_cisp_km2, area_aisp_km2, area_risp_km2)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (
                    int(row["cisp"]),
                    int(row["aisp"]),
                    int(row["risp"]),
                    float(row["area_cisp_km2"]),
                    float(row["area_aisp_km2"]),
                    float(row["area_risp_km2"]),
                ),
            )

        conn.commit()
        print("Upload de áreas completo!")
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Erro ao fazer o upload de áreas: {e}")


# def upload_armas_apreendidas(csv_file):
#     try:
#         conn = connect_db()
#         if conn is None:
#             return

#         cursor = conn.cursor()

#         df = normalize_csv(csv_file)

#         expected_columns = 42
#         if len(df.columns) != expected_columns:
#             print(
#                 f"Erro: número de colunas no CSV ({len(df.columns)}) não corresponde ao esperado ({expected_columns})."
#             )
#             return

#         for index, row in df.iterrows():

#             values_to_insert = (
#                 int(row["cisp"]),
#                 int(row["mes"]),
#                 int(row["ano"]),
#                 int(row["aisp"]),
#                 int(row["risp"]),
#                 int(row["arma_fogo_arma_fabricacao_caseira"]),
#                 int(row["arma_fogo_carabina"]),
#                 int(row["arma_fogo_espingarda"]),
#                 int(row["arma_fogo_fuzil"]),
#                 int(row["arma_fogo_garrucha"]),
#                 int(row["arma_fogo_garruchao"]),
#                 int(row["arma_fogo_metralhadora"]),
#                 int(row["arma_fogo_outros"]),
#                 int(row["arma_fogo_pistola"]),
#                 int(row["arma_fogo_revolver"]),
#                 int(row["arma_fogo_submetralhadora"]),
#                 int(row["arma_fogo_total"]),
#                 int(row["arma_branca_total"]),
#                 int(row["artefato_explosivo_armadilha_explosiva"]),
#                 int(row["artefato_explosivo_armadilha_incendiaria"]),
#                 int(row["artefato_explosivo_bomba_fabricacao_caseira"]),
#                 int(row["artefato_explosivo_granada"]),
#                 int(row["artefato_explosivo_material_belico_explosivo"]),
#                 int(row["artefato_explosivo_material_explosivo"]),
#                 int(row["artefato_explosivo_material_explosivo_caseiro"]),
#                 int(row["artefato_explosivo_material_nao_identificado"]),
#                 int(row["artefato_explosivo_total"]),
#                 int(row["municao_total"]),
#                 int(row["simulacro_airsoft"]),
#                 int(row["simulacro_arma_fabricacao_caseira"]),
#                 int(row["simulacro_carabina"]),
#                 int(row["simulacro_espingarda"]),
#                 int(row["simulacro_fuzil"]),
#                 int(row["simulacro_garrucha"]),
#                 int(row["simulacro_garruchao"]),
#                 int(row["simulacro_metralhadora"]),
#                 int(row["simulacro_outros"]),
#                 int(row["simulacro_paintball"]),
#                 int(row["simulacro_pistola"]),
#                 int(row["simulacro_revolver"]),
#                 int(row["simulacro_submetralhadora"]),
#                 int(row["simulacro_total"]),
#             )

#             cursor.execute(
#                 """
#                 INSERT INTO armaapreendida (
#                     cisp, mes, ano, aisp, risp,
#                     arma_fogo_arma_fabricacao_caseira, arma_fogo_carabina,
#                     arma_fogo_espingarda, arma_fogo_fuzil,
#                     arma_fogo_garrucha, arma_fogo_garruchao,
#                     arma_fogo_metralhadora, arma_fogo_outros,
#                     arma_fogo_pistola, arma_fogo_revolver,
#                     arma_fogo_submetralhadora, arma_fogo_total,
#                     arma_branca_total,
#                     artefato_explosivo_armadilha_explosiva,
#                     artefato_explosivo_armadilha_incendiaria,
#                     artefato_explosivo_bomba_fabricacao_caseira,
#                     artefato_explosivo_granada,
#                     artefato_explosivo_material_belico_explosivo,
#                     artefato_explosivo_material_explosivo,
#                     artefato_explosivo_material_explosivo_caseiro,
#                     artefato_explosivo_material_nao_identificado,
#                     artefato_explosivo_total,
#                     municao_total,
#                     simulacro_airsoft,
#                     simulacro_arma_fabricacao_caseira,
#                     simulacro_carabina,
#                     simulacro_espingarda,
#                     simulacro_fuzil,
#                     simulacro_garrucha,
#                     simulacro_garruchao,
#                     simulacro_metralhadora,
#                     simulacro_outros,
#                     simulacro_paintball,
#                     simulacro_pistola,
#                     simulacro_revolver,
#                     simulacro_submetralhadora,
#                     simulacro_total
#                 )
#                 VALUES (%s, %s, %s, %s, %s,
#                         %s, %s, %s, %s, %s,
#                         %s, %s, %s, %s, %s,
#                         %s, %s, %s, %s, %s,
#                         %s, %s, %s, %s, %s,
#                         %s, %s, %s, %s, %s,
#                         %s, %s, %s, %s, %s,
#                         %s, %s, %s, %s, %s,
#                         %s, %s)
#                 """,
#                 values_to_insert,
#             )

#         conn.commit()
#         print("Upload de armas apreendidas completo!")
#         cursor.close()
#         conn.close()
#     except Exception as e:
#         print(f"Erro ao fazer o upload de armas apreendidas: {e}")


def upload_armas_apreendidas(csv_file, batch_size=1000):
    try:
        conn = connect_db()
        if conn is None:
            return

        cursor = conn.cursor()

        df = normalize_csv(csv_file)

        expected_columns = 42
        if len(df.columns) != expected_columns:
            print(
                f"Erro: número de colunas no CSV ({len(df.columns)}) não corresponde ao esperado ({expected_columns})."
            )
            return

        total_rows = len(df)
        print(f"Iniciando o upload de {total_rows} linhas em lotes de {batch_size}...")

        # Processar o upload em lotes
        for i in range(0, total_rows, batch_size):
            batch = df.iloc[i : i + batch_size]
            values_to_insert = [
                (
                    int(row["cisp"]),
                    int(row["mes"]),
                    int(row["ano"]),
                    int(row["aisp"]),
                    int(row["risp"]),
                    int(row["arma_fogo_arma_fabricacao_caseira"]),
                    int(row["arma_fogo_carabina"]),
                    int(row["arma_fogo_espingarda"]),
                    int(row["arma_fogo_fuzil"]),
                    int(row["arma_fogo_garrucha"]),
                    int(row["arma_fogo_garruchao"]),
                    int(row["arma_fogo_metralhadora"]),
                    int(row["arma_fogo_outros"]),
                    int(row["arma_fogo_pistola"]),
                    int(row["arma_fogo_revolver"]),
                    int(row["arma_fogo_submetralhadora"]),
                    int(row["arma_fogo_total"]),
                    int(row["arma_branca_total"]),
                    int(row["artefato_explosivo_armadilha_explosiva"]),
                    int(row["artefato_explosivo_armadilha_incendiaria"]),
                    int(row["artefato_explosivo_bomba_fabricacao_caseira"]),
                    int(row["artefato_explosivo_granada"]),
                    int(row["artefato_explosivo_material_belico_explosivo"]),
                    int(row["artefato_explosivo_material_explosivo"]),
                    int(row["artefato_explosivo_material_explosivo_caseiro"]),
                    int(row["artefato_explosivo_material_nao_identificado"]),
                    int(row["artefato_explosivo_total"]),
                    int(row["municao_total"]),
                    int(row["simulacro_airsoft"]),
                    int(row["simulacro_arma_fabricacao_caseira"]),
                    int(row["simulacro_carabina"]),
                    int(row["simulacro_espingarda"]),
                    int(row["simulacro_fuzil"]),
                    int(row["simulacro_garrucha"]),
                    int(row["simulacro_garruchao"]),
                    int(row["simulacro_metralhadora"]),
                    int(row["simulacro_outros"]),
                    int(row["simulacro_paintball"]),
                    int(row["simulacro_pistola"]),
                    int(row["simulacro_revolver"]),
                    int(row["simulacro_submetralhadora"]),
                    int(row["simulacro_total"]),
                )
                for _, row in batch.iterrows()
            ]

            # Executar o batch insert
            cursor.executemany(
                """
                INSERT INTO armaapreendida (
                    cisp, mes, ano, aisp, risp, 
                    arma_fogo_arma_fabricacao_caseira, arma_fogo_carabina, 
                    arma_fogo_espingarda, arma_fogo_fuzil, 
                    arma_fogo_garrucha, arma_fogo_garruchao, 
                    arma_fogo_metralhadora, arma_fogo_outros, 
                    arma_fogo_pistola, arma_fogo_revolver, 
                    arma_fogo_submetralhadora, arma_fogo_total, 
                    arma_branca_total, 
                    artefato_explosivo_armadilha_explosiva, 
                    artefato_explosivo_armadilha_incendiaria, 
                    artefato_explosivo_bomba_fabricacao_caseira,
                    artefato_explosivo_granada, 
                    artefato_explosivo_material_belico_explosivo, 
                    artefato_explosivo_material_explosivo, 
                    artefato_explosivo_material_explosivo_caseiro, 
                    artefato_explosivo_material_nao_identificado, 
                    artefato_explosivo_total, 
                    municao_total, 
                    simulacro_airsoft, 
                    simulacro_arma_fabricacao_caseira, 
                    simulacro_carabina, 
                    simulacro_espingarda, 
                    simulacro_fuzil, 
                    simulacro_garrucha, 
                    simulacro_garruchao, 
                    simulacro_metralhadora, 
                    simulacro_outros, 
                    simulacro_paintball, 
                    simulacro_pistola, 
                    simulacro_revolver, 
                    simulacro_submetralhadora, 
                    simulacro_total
                )
                VALUES (%s, %s, %s, %s, %s, 
                        %s, %s, %s, %s, %s, 
                        %s, %s, %s, %s, %s, 
                        %s, %s, %s, %s, %s, 
                        %s, %s, %s, %s, %s, 
                        %s, %s, %s, %s, %s, 
                        %s, %s, %s, %s, %s, 
                        %s, %s, %s, %s, %s, 
                        %s, %s)
                """,
                values_to_insert,
            )

            # Confirmar a transação após cada lote
            conn.commit()
            print(
                f"Lote {i // batch_size + 1} de {total_rows // batch_size + 1} carregado."
            )

        print("Upload de armas apreendidas completo!")
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Erro ao fazer o upload de armas apreendidas: {e}")


# cretate_table_areas_regiao()
# cretate_table_armas()
# upload_areas_regiao("AreasemKm.csv")
upload_armas_apreendidas("ArmasApreendidasEvolucaoCisp.csv")
