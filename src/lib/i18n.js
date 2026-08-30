// Internationalization dictionary for MediScan.
// Supported: English, Spanish, French, Simplified Chinese, Portuguese, Arabic.

export const LANGS = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "zh", name: "中文" },
  { code: "pt", name: "Português" },
  { code: "ar", name: "العربية" },
];

export const isRTL = (code) => code === "ar";

export function langName(code) {
  return LANGS.find((l) => l.code === code)?.name || code;
}

const D = {
  "nav.scan": { en: "Scan", es: "Escanear", fr: "Scanner", zh: "扫描", pt: "Digitalizar", ar: "مسح" },
  "nav.library": { en: "Library", es: "Biblioteca", fr: "Bibliothèque", zh: "药库", pt: "Biblioteca", ar: "المكتبة" },
  "nav.allergies": { en: "Allergies", es: "Alergias", fr: "Allergies", zh: "过敏", pt: "Alergias", ar: "الحساسية" },
  "nav.profile": { en: "Profile", es: "Perfil", fr: "Profil", zh: "资料", pt: "Perfil", ar: "الملف الشخصي" },

  "common.signOut": { en: "Sign out", es: "Cerrar sesión", fr: "Déconnexion", zh: "退出", pt: "Sair", ar: "تسجيل الخروج" },
  "common.loading": { en: "Loading…", es: "Cargando…", fr: "Chargement…", zh: "加载中…", pt: "Carregando…", ar: "جارٍ التحميل…" },
  "common.add": { en: "Add", es: "Añadir", fr: "Ajouter", zh: "添加", pt: "Adicionar", ar: "إضافة" },

  "footer.disclaimer": {
    en: "Informational only — always follow your doctor or pharmacist's instructions.",
    es: "Solo informativo — siga siempre las instrucciones de su médico o farmacéutico.",
    fr: "Information uniquement — suivez toujours les instructions de votre médecin ou pharmacien.",
    zh: "仅供参考 — 请始终遵医嘱或药剂师指导。",
    pt: "Apenas informativo — siga sempre as instruções do seu médico ou farmacêutico.",
    ar: "للاستعلام فقط — اتبع دائمًا تعليمات طبيبك أو الصيدلي.",
  },

  "scan.summaryTitle": { en: "Your medications", es: "Sus medicamentos", fr: "Vos médicaments", zh: "您的药物", pt: "Seus medicamentos", ar: "أدويتك" },
  "scan.summaryDesc": { en: "{n} medication(s) captured. Review the table, then save to your library.", es: "{n} medicamento(s) capturado(s). Revisa la tabla y guárdala en tu biblioteca.", fr: "{n} médicament(s) capturé(s). Vérifiez le tableau puis enregistrez.", zh: "已捕获 {n} 种药物。查看表格后保存到药库。", pt: "{n} medicamento(s) capturado(s). Revise a tabela e salve na biblioteca.", ar: "تم التقاط {n} دواء. راجع الجدول ثم احفظه في مكتبتك." },
  "scan.addedSoFar": { en: "{n} medication(s) added so far", es: "{n} medicamento(s) añadido(s) hasta ahora", fr: "{n} médicament(s) ajouté(s)", zh: "已添加 {n} 种药物", pt: "{n} medicamento(s) adicionado(s)", ar: "تمت إضافة {n} دواء حتى الآن" },
  "scan.viewTable": { en: "View table", es: "Ver tabla", fr: "Voir le tableau", zh: "查看表格", pt: "Ver tabela", ar: "عرض الجدول" },
  "scan.photosReady": { en: "{n} photo(s) ready — add more if the label has more detail.", es: "{n} foto(s) lista(s) — añade más si la etiqueta tiene más detalle.", fr: "{n} photo(s) prête(s) — ajoutez-en si l'étiquette a plus de détails.", zh: "已准备 {n} 张照片 — 如标签有更多细节可继续添加。", pt: "{n} foto(s) pronta(s) — adicione mais se o rótulo tiver mais detalhes.", ar: "{n} صورة جاهزة — أضف المزيد إذا كان الملصق يحتوي على تفاصيل أكثر." },
  "scan.takePhoto": { en: "Take photo", es: "Tomar foto", fr: "Prendre une photo", zh: "拍照", pt: "Tirar foto", ar: "التقاط صورة" },
  "scan.upload": { en: "Upload", es: "Subir", fr: "Téléverser", zh: "上传", pt: "Enviar", ar: "رفع" },
  "scan.analyze": { en: "Analyze {n} photo(s)", es: "Analizar {n} foto(s)", fr: "Analyser {n} photo(s)", zh: "分析 {n} 张照片", pt: "Analisar {n} foto(s)", ar: "تحليل {n} صورة" },
  "scan.uploading": { en: "Uploading photos…", es: "Subiendo fotos…", fr: "Téléversement des photos…", zh: "正在上传照片…", pt: "Enviando fotos…", ar: "جارٍ رفع الصور…" },
  "scan.reading": { en: "Reading the labels…", es: "Leyendo las etiquetas…", fr: "Lecture des étiquettes…", zh: "正在读取标签…", pt: "Lendo os rótulos…", ar: "جارٍ قراءة الملصقات…" },
  "scan.notMed": { en: "We couldn't find a medication in those photos. Try a clearer shot of the label.", es: "No encontramos un medicamento en esas fotos. Toma una foto más clara de la etiqueta.", fr: "Aucun médicament trouvé dans ces photos. Prenez une photo plus nette de l'étiquette.", zh: "未能在这些照片中找到药物，请拍摄更清晰的标签。", pt: "Não encontramos medicamento nessas fotos. Tire uma foto mais nítida do rótulo.", ar: "لم نتمكن من العثور على دواء في هذه الصور. التقط صورة أوضح للملصق." },
  "scan.error": { en: "Something went wrong reading those photos. Please try again.", es: "Algo salió mal al leer esas fotos. Inténtalo de nuevo.", fr: "Une erreur est survenue lors de la lecture. Réessayez.", zh: "读取照片时出错，请重试。", pt: "Algo deu errado ao ler as fotos. Tente novamente.", ar: "حدث خطأ أثناء قراءة الصور. حاول مرة أخرى." },
  "scan.startOver": { en: "Start over", es: "Empezar de nuevo", fr: "Recommencer", zh: "重新开始", pt: "Começar de novo", ar: "البدء من جديد" },
  "scan.saveN": { en: "Save {n} to library", es: "Guardar {n} en la biblioteca", fr: "Enregistrer {n}", zh: "保存 {n} 到药库", pt: "Salvar {n} na biblioteca", ar: "حفظ {n} في المكتبة" },
  "scan.safetySection": { en: "Safety checks", es: "Verificaciones de seguridad", fr: "Contrôles de sécurité", zh: "安全检查", pt: "Verificações de segurança", ar: "فحوصات الأمان" },
  "scan.exportTitle": { en: "Download", es: "Descargar", fr: "Télécharger", zh: "下载", pt: "Baixar", ar: "تنزيل" },

  "confirm.title": { en: "Confirm the details", es: "Confirma los detalles", fr: "Confirmez les détails", zh: "确认详情", pt: "Confirme os detalhes", ar: "أكد التفاصيل" },
  "confirm.desc": { en: "Check the extracted information and fix anything that's wrong before adding the next medication.", es: "Revisa la información extraída y corrige lo que esté mal antes de añadir el siguiente medicamento.", fr: "Vérifiez les informations extraites et corrigez les erreurs avant d'ajouter le médicament suivant.", zh: "核对提取的信息并更正错误，然后再添加下一种药物。", pt: "Verifique as informações extraídas e corrija o que estiver errado antes de adicionar o próximo medicamento.", ar: "راجع المعلومات المستخرجة وصحح أي خطأ قبل إضافة الدواء التالي." },
  "confirm.rescan": { en: "← Rescan", es: "← Volver a escanear", fr: "← Re-scanner", zh: "← 重新扫描", pt: "← Escanear novamente", ar: "← إعادة المسح" },
  "confirm.addAnother": { en: "Add another medication", es: "Añadir otro medicamento", fr: "Ajouter un autre médicament", zh: "添加另一种药物", pt: "Adicionar outro medicamento", ar: "إضافة دواء آخر" },
  "confirm.done": { en: "Done — view table", es: "Listo — ver tabla", fr: "Terminé — voir le tableau", zh: "完成 — 查看表格", pt: "Concluído — ver tabela", ar: "تم — عرض الجدول" },
  "confirm.f.name": { en: "Medication name", es: "Nombre del medicamento", fr: "Nom du médicament", zh: "药物名称", pt: "Nome do medicamento", ar: "اسم الدواء" },
  "confirm.f.generic": { en: "Generic name", es: "Nombre genérico", fr: "Nom générique", zh: "通用名", pt: "Nome genérico", ar: "الاسم العام" },
  "confirm.f.dose": { en: "Dose", es: "Dosis", fr: "Dose", zh: "剂量", pt: "Dose", ar: "الجرعة" },
  "confirm.f.form": { en: "Form", es: "Forma", fr: "Forme", zh: "剂型", pt: "Forma", ar: "الشكل" },
  "confirm.f.frequency": { en: "Frequency", es: "Frecuencia", fr: "Fréquence", zh: "频次", pt: "Frequência", ar: "التكرار" },
  "confirm.f.route": { en: "Route", es: "Vía", fr: "Voie", zh: "给药途径", pt: "Via", ar: "طريقة الإعطاء" },
  "confirm.f.quantity": { en: "Quantity", es: "Cantidad", fr: "Quantité", zh: "数量", pt: "Quantidade", ar: "الكمية" },
  "confirm.f.purpose": { en: "Used for", es: "Uso", fr: "Usage", zh: "用途", pt: "Uso", ar: "يُستخدم لـ" },
  "confirm.f.storage": { en: "Storage", es: "Conservación", fr: "Conservation", zh: "储存", pt: "Armazenamento", ar: "التخزين" },
  "confirm.f.manufacturer": { en: "Manufacturer", es: "Fabricante", fr: "Fabricant", zh: "制造商", pt: "Fabricante", ar: "المُصنّع" },
  "confirm.f.expiration": { en: "Expiration date", es: "Fecha de caducidad", fr: "Date d'expiration", zh: "有效期", pt: "Validade", ar: "تاريخ الانتهاء" },
  "confirm.f.active": { en: "Active ingredients (one per line — each component of a combo drug)", es: "Ingredientes activos (uno por línea — cada componente de un combinado)", fr: "Ingrédients actifs (un par ligne — chaque composant d'une combinaison)", zh: "活性成分（每行一个 — 复方药的每个成分）", pt: "Ingredientes ativos (um por linha — cada componente de um combinado)", ar: "المكونات النشطة (واحد لكل سطر — كل مكون من الدواء المركب)" },
  "confirm.f.inactive": { en: "Inactive ingredients (one per line)", es: "Ingredientes inactivos (uno por línea)", fr: "Ingrédients inactifs (un par ligne)", zh: "非活性成分（每行一个）", pt: "Ingredientes inativos (um por linha)", ar: "المكونات غير النشطة (واحد لكل سطر)" },
  "confirm.f.sideEffects": { en: "Side effects (one per line)", es: "Efectos secundarios (uno por línea)", fr: "Effets secondaires (un par ligne)", zh: "副作用（每行一个）", pt: "Efeitos colaterais (um por linha)", ar: "الآثار الجانبية (واحد لكل سطر)" },
  "confirm.f.warnings": { en: "Warnings (one per line)", es: "Advertencias (uno por línea)", fr: "Avertissements (un par ligne)", zh: "警告（每行一个）", pt: "Avisos (um por linha)", ar: "التحذيرات (واحد لكل سطر)" },

  "library.title": { en: "Your medications", es: "Sus medicamentos", fr: "Vos médicaments", zh: "您的药物", pt: "Seus medicamentos", ar: "أدويتك" },
  "library.desc": { en: "Everything you've scanned — prescriptions, OTC, and supplements together.", es: "Todo lo que has escaneado — recetas, OTC y suplementos juntos.", fr: "Tout ce que vous avez scanné — ordonnances, OTC et compléments ensemble.", zh: "您扫描的所有内容 — 处方药、非处方药和补充剂。", pt: "Tudo que você digitalizou — receitas, OTC e suplementos juntos.", ar: "كل ما قمت بمسحه — الوصفات والأدوية بدون وصفة والمكملات معًا." },
  "library.filterAll": { en: "All", es: "Todos", fr: "Tous", zh: "全部", pt: "Todos", ar: "الكل" },
  "library.filterRx": { en: "Prescription", es: "Receta", fr: "Ordonnance", zh: "处方药", pt: "Receita", ar: "بوصفة" },
  "library.filterOtc": { en: "OTC", es: "OTC", fr: "OTC", zh: "非处方药", pt: "OTC", ar: "بدون وصفة" },
  "library.filterSupp": { en: "Supplements", es: "Suplementos", fr: "Compléments", zh: "补充剂", pt: "Suplementos", ar: "مكملات" },
  "library.search": { en: "Search by name", es: "Buscar por nombre", fr: "Rechercher par nom", zh: "按名称搜索", pt: "Pesquisar por nome", ar: "البحث بالاسم" },
  "library.empty": { en: "Nothing here yet — scan your first medication.", es: "Aún no hay nada — escanea tu primer medicamento.", fr: "Rien pour l'instant — scannez votre premier médicament.", zh: "还没有内容 — 扫描您的第一种药物。", pt: "Nada aqui ainda — digitalize seu primeiro medicamento.", ar: "لا شيء بعد — امسح أول دواء." },
  "library.scanNow": { en: "Scan now", es: "Escanear ahora", fr: "Scanner maintenant", zh: "立即扫描", pt: "Digitalizar agora", ar: "امسح الآن" },
  "library.colName": { en: "Name", es: "Nombre", fr: "Nom", zh: "名称", pt: "Nome", ar: "الاسم" },
  "library.colType": { en: "Type", es: "Tipo", fr: "Type", zh: "类型", pt: "Tipo", ar: "النوع" },
  "library.colDose": { en: "Dose", es: "Dosis", fr: "Dose", zh: "剂量", pt: "Dose", ar: "الجرعة" },
  "library.colFreq": { en: "Frequency", es: "Frecuencia", fr: "Fréquence", zh: "频次", pt: "Frequência", ar: "التكرار" },
  "library.colUsed": { en: "Used for", es: "Uso", fr: "Usage", zh: "用途", pt: "Uso", ar: "يُستخدم لـ" },

  "allergies.title": { en: "Your allergies", es: "Tus alergias", fr: "Vos allergies", zh: "您的过敏", pt: "Suas alergias", ar: "حساسياتك" },
  "allergies.desc": { en: "Add the food or chemical ingredients you're allergic to. Every medication you scan is cross-checked against this list.", es: "Añade los ingredientes alimentarios o químicos a los que eres alérgico. Cada medicamento que escaneas se verifica con esta lista.", fr: "Ajoutez les ingrédients alimentaires ou chimiques auxquels vous êtes allergique. Chaque médicament scanné est vérifié contre cette liste.", zh: "添加您过敏的食物或化学成分。您扫描的每种药物都会与此列表交叉核对。", pt: "Adicione os ingredientes alimentares ou químicos aos quais você é alérgico. Cada medicamento digitalizado é verificado com esta lista.", ar: "أضف المكونات الغذائية أو الكيميائية التي تعاني من حساسية تجاهها. يتم التحقق من كل دواء تمسحه مقابل هذه القائمة." },
  "allergies.placeholder": { en: "e.g. Lactose, Yellow No. 5, Gluten", es: "p. ej. Lactosa, Amarillo No. 5, Gluten", fr: "ex. Lactose, Jaune No. 5, Gluten", zh: "例如：乳糖、5号黄、麸质", pt: "ex. Lactose, Amarelo No. 5, Glúten", ar: "مثال: اللاكتوز، الأصفر رقم 5، الغلوتين" },
  "allergies.catFood": { en: "Food", es: "Comida", fr: "Aliment", zh: "食物", pt: "Alimento", ar: "طعام" },
  "allergies.catChemical": { en: "Chemical", es: "Químico", fr: "Chimique", zh: "化学", pt: "Químico", ar: "كيميائي" },
  "allergies.catOther": { en: "Other", es: "Otro", fr: "Autre", zh: "其他", pt: "Outro", ar: "أخرى" },
  "allergies.empty": { en: "No allergies recorded yet.", es: "Aún no hay alergias registradas.", fr: "Aucune allergie enregistrée.", zh: "尚未记录过敏。", pt: "Nenhuma alergia registrada.", ar: "لا توجد حساسيات مسجلة بعد." },

  "profile.title": { en: "Your profile", es: "Tu perfil", fr: "Votre profil", zh: "您的资料", pt: "Seu perfil", ar: "ملفك الشخصي" },
  "profile.desc": { en: "This personalizes your allergy cross-checks and the language you use MediScan in.", es: "Esto personaliza tus verificaciones de alergias y el idioma de MediScan.", fr: "Ceci personnalise vos vérifications d'allergies et la langue de MediScan.", zh: "这将个性化您的过敏交叉检查和 MediScan 的使用语言。", pt: "Isso personaliza suas verificações de alergias e o idioma do MediScan.", ar: "يخصص هذا فحوصات الحساسية ولغة استخدام MediScan." },
  "profile.name": { en: "Name", es: "Nombre", fr: "Nom", zh: "姓名", pt: "Nome", ar: "الاسم" },
  "profile.sex": { en: "Sex", es: "Sexo", fr: "Sexe", zh: "性别", pt: "Sexo", ar: "الجنس" },
  "profile.sexMale": { en: "Male", es: "Masculino", fr: "Homme", zh: "男", pt: "Masculino", ar: "ذكر" },
  "profile.sexFemale": { en: "Female", es: "Femenino", fr: "Femme", zh: "女", pt: "Feminino", ar: "أنثى" },
  "profile.sexOther": { en: "Other", es: "Otro", fr: "Autre", zh: "其他", pt: "Outro", ar: "أخرى" },
  "profile.dob": { en: "Date of birth", es: "Fecha de nacimiento", fr: "Date de naissance", zh: "出生日期", pt: "Data de nascimento", ar: "تاريخ الميلاد" },
  "profile.height": { en: "Height", es: "Altura", fr: "Taille", zh: "身高", pt: "Altura", ar: "الطول" },
  "profile.weight": { en: "Weight", es: "Peso", fr: "Poids", zh: "体重", pt: "Peso", ar: "الوزن" },
  "profile.language": { en: "Language preference", es: "Preferencia de idioma", fr: "Préférence de langue", zh: "语言偏好", pt: "Preferência de idioma", ar: "تفضيل اللغة" },
  "profile.save": { en: "Save profile", es: "Guardar perfil", fr: "Enregistrer le profil", zh: "保存资料", pt: "Salvar perfil", ar: "حفظ الملف الشخصي" },
  "profile.saved": { en: "Saved ✓", es: "Guardado ✓", fr: "Enregistré ✓", zh: "已保存 ✓", pt: "Salvo ✓", ar: "تم الحفظ ✓" },
  "profile.allergies": { en: "Allergies", es: "Alergias", fr: "Allergies", zh: "过敏", pt: "Alergias", ar: "الحساسية" },
  "profile.allergiesCount": { en: "{n} recorded", es: "{n} registrada(s)", fr: "{n} enregistrée(s)", zh: "已记录 {n} 项", pt: "{n} registrada(s)", ar: "تم تسجيل {n}" },
  "profile.manage": { en: "Manage allergies", es: "Gestionar alergias", fr: "Gérer les allergies", zh: "管理过敏", pt: "Gerenciar alergias", ar: "إدارة الحساسية" },
  "profile.langHint": { en: "You can switch language anytime from the top bar.", es: "Puedes cambiar el idioma en cualquier momento desde la barra superior.", fr: "Vous pouvez changer de langue à tout moment depuis la barre supérieure.", zh: "您可以随时从顶部栏切换语言。", pt: "Você pode mudar o idioma a qualquer momento na barra superior.", ar: "يمكنك تغيير اللغة في أي وقت من الشريط العلوي." },

  "detail.back": { en: "Library", es: "Biblioteca", fr: "Bibliothèque", zh: "药库", pt: "Biblioteca", ar: "المكتبة" },
  "detail.notFound": { en: "Medication not found.", es: "Medicamento no encontrado.", fr: "Médicament introuvable.", zh: "未找到药物。", pt: "Medicamento não encontrado.", ar: "الدواء غير موجود." },

  "safety.title": { en: "Safety check", es: "Verificación de seguridad", fr: "Contrôle de sécurité", zh: "安全检查", pt: "Verificação de segurança", ar: "فحص الأمان" },
  "safety.allergy": { en: "Allergy alert", es: "Alerta de alergia", fr: "Alerte allergie", zh: "过敏提醒", pt: "Alerta de alergia", ar: "تنبيه حساسية" },
  "safety.allergyMsg": { en: "Contains {x}, which you're allergic to.", es: "Contiene {x}, al que eres alérgico.", fr: "Contient {x}, auquel vous êtes allergique.", zh: "含有 {x}，您对此过敏。", pt: "Contém {x}, ao qual você é alérgico.", ar: "يحتوي على {x} الذي تعاني من حساسية تجاهه." },
  "safety.duplicate": { en: "Same ingredient in another medicine", es: "Mismo ingrediente en otra medicina", fr: "Même ingrédient dans un autre médicament", zh: "与其他药物含有相同成分", pt: "Mesmo ingrediente em outro remédio", ar: "نفس المكون في دواء آخر" },
  "safety.duplicateMsg": { en: "This and {others} both contain “{x}”. Taking both could give you too much of it.", es: "Este y {others} contienen «{x}». Tomar ambos podría darte una cantidad excesiva.", fr: "Celui-ci et {others} contiennent tous deux « {x} ». Les prendre ensemble peut être excessif.", zh: "此药和 {others} 都含有“{x}”。同时服用可能过量。", pt: "Este e {others} contêm “{x}”. Tomar ambos pode ser excessivo.", ar: "هذا و{others} كلاهما يحتوي على «{x}». تناولهما معًا قد يكون مفرطًا." },
  "safety.with": { en: "With {med}", es: "Con {med}", fr: "Avec {med}", zh: "与 {med}", pt: "Com {med}", ar: "مع {med}" },
  "safety.drugDrug": { en: "Other medicines", es: "Otras medicinas", fr: "Autres médicaments", zh: "其他药物", pt: "Outros remédios", ar: "أدوية أخرى" },
  "safety.drugFood": { en: "Food & drink", es: "Alimentos y bebidas", fr: "Aliments et boissons", zh: "食物和饮品", pt: "Alimentos e bebidas", ar: "أطعمة ومشروبات" },
  "safety.noIssues": { en: "No safety problems found.", es: "No se encontraron problemas de seguridad.", fr: "Aucun problème de sécurité.", zh: "未发现安全问题。", pt: "Nenhum problema de segurança.", ar: "لا توجد مشاكل أمان." },
  "safety.checking": { en: "Checking safety…", es: "Comprobando seguridad…", fr: "Vérification de sécurité…", zh: "正在检查安全…", pt: "Verificando segurança…", ar: "جارٍ فحص الأمان…" },

  "table.title": { en: "Your medications", es: "Sus medicamentos", fr: "Vos médicaments", zh: "您的药物", pt: "Seus medicamentos", ar: "أدويتك" },
  "table.name": { en: "Name", es: "Nombre", fr: "Nom", zh: "名称", pt: "Nome", ar: "الاسم" },
  "table.generic": { en: "Generic name", es: "Nombre genérico", fr: "Nom générique", zh: "通用名", pt: "Nome genérico", ar: "الاسم العام" },
  "table.category": { en: "Category", es: "Categoría", fr: "Catégorie", zh: "类别", pt: "Categoria", ar: "الفئة" },
  "table.dose": { en: "Dose", es: "Dosis", fr: "Dose", zh: "剂量", pt: "Dose", ar: "الجرعة" },
  "table.form": { en: "Form", es: "Forma", fr: "Forme", zh: "剂型", pt: "Forma", ar: "الشكل" },
  "table.frequency": { en: "Frequency", es: "Frecuencia", fr: "Fréquence", zh: "频次", pt: "Frequência", ar: "التكرار" },
  "table.route": { en: "Route", es: "Vía", fr: "Voie", zh: "给药途径", pt: "Via", ar: "طريقة الإعطاء" },
  "table.quantity": { en: "Quantity", es: "Cantidad", fr: "Quantité", zh: "数量", pt: "Quantidade", ar: "الكمية" },
  "table.purpose": { en: "Used for", es: "Uso", fr: "Usage", zh: "用途", pt: "Uso", ar: "يُستخدم لـ" },
  "table.active": { en: "Active ingredients", es: "Ingredientes activos", fr: "Ingrédients actifs", zh: "活性成分", pt: "Ingredientes ativos", ar: "المكونات النشطة" },
  "table.inactive": { en: "Inactive ingredients", es: "Ingredientes inactivos", fr: "Ingrédients inactifs", zh: "非活性成分", pt: "Ingredientes inativos", ar: "المكونات غير النشطة" },
  "table.sideEffects": { en: "Side effects", es: "Efectos secundarios", fr: "Effets secondaires", zh: "副作用", pt: "Efeitos colaterais", ar: "الآثار الجانبية" },
  "table.warnings": { en: "Warnings", es: "Advertencias", fr: "Avertissements", zh: "警告", pt: "Avisos", ar: "التحذيرات" },
  "table.storage": { en: "Storage", es: "Conservación", fr: "Conservation", zh: "储存", pt: "Armazenamento", ar: "التخزين" },
  "table.manufacturer": { en: "Manufacturer", es: "Fabricante", fr: "Fabricant", zh: "制造商", pt: "Fabricante", ar: "المُصنّع" },
  "table.expiration": { en: "Expiration date", es: "Fecha de caducidad", fr: "Date d'expiration", zh: "有效期", pt: "Validade", ar: "تاريخ الانتهاء" },
  "table.catRx": { en: "Rx", es: "Rx", fr: "Rx", zh: "处方", pt: "Rx", ar: "وصفة" },
  "table.catOtc": { en: "OTC", es: "OTC", fr: "OTC", zh: "非处方", pt: "OTC", ar: "بدون وصفة" },
  "table.catSupp": { en: "Supplement", es: "Suplemento", fr: "Complément", zh: "补充剂", pt: "Suplemento", ar: "مكمل" },
  "table.notes": { en: "Notes", es: "Notas", fr: "Notes", zh: "备注", pt: "Notas", ar: "ملاحظات" },
  "a11y.readAloud": { en: "Read aloud", es: "Leer en voz alta", fr: "Lire à voix haute", zh: "朗读", pt: "Ler em voz alta", ar: "قراءة بصوت" },
  "a11y.stop": { en: "Stop", es: "Detener", fr: "Arrêter", zh: "停止", pt: "Parar", ar: "إيقاف" },
  "a11y.normal": { en: "Normal", es: "Normal", fr: "Normal", zh: "标准", pt: "Normal", ar: "عادي" },
  "a11y.large": { en: "Large", es: "Grande", fr: "Grand", zh: "大", pt: "Grande", ar: "كبير" },
  "a11y.xlarge": { en: "Extra large", es: "Muy grande", fr: "Très grand", zh: "特大", pt: "Muito grande", ar: "كبير جدًا" },
  "profile.textSize": { en: "Text size", es: "Tamaño del texto", fr: "Taille du texte", zh: "文字大小", pt: "Tamanho do texto", ar: "حجم النص" },
  "profile.textSizeHint": { en: "Makes all the text bigger so it's easier to read.", es: "Hace todo el texto más grande para facilitar la lectura.", fr: "Agrandit tout le texte pour faciliter la lecture.", zh: "放大所有文字以便于阅读。", pt: "Aumenta todo o texto para facilitar a leitura.", ar: "يكبر كل النص لتسهيل القراءة." },
  "profile.welcome": { en: "Welcome! Create your profile to start using MediScan.", es: "¡Bienvenido! Crea tu perfil para empezar a usar MediScan.", fr: "Bienvenue ! Créez votre profil pour commencer à utiliser MediScan.", zh: "欢迎！请创建您的个人资料以开始使用 MediScan。", pt: "Bem-vindo! Crie seu perfil para começar a usar o MediScan.", ar: "مرحبًا! أنشئ ملفك الشخصي للبدء في استخدام MediScan." },
  "profile.requiredNotice": { en: "You need to create your profile before you can use the app. Please fill in your name and tap Save.", es: "Debes crear tu perfil antes de poder usar la app. Completa tu nombre y toca Guardar.", fr: "Vous devez créer votre profil avant de pouvoir utiliser l'application. Saisissez votre nom et appuyez sur Enregistrer.", zh: "您必须先创建个人资料才能使用本应用。请填写姓名并点击保存。", pt: "Você precisa criar seu perfil antes de usar o app. Preencha seu nome e toque em Salvar.", ar: "يجب إنشاء ملفك الشخصي قبل أن تتمكن من استخدام التطبيق. يرجى إدخال اسمك والضغط على حفظ." },

  "export.preparedFor": { en: "Prepared for", es: "Preparado para", fr: "Préparé pour", zh: "编制于", pt: "Preparado para", ar: "أُعدّ لـ" },
  "export.date": { en: "Date", es: "Fecha", fr: "Date", zh: "日期", pt: "Data", ar: "التاريخ" },
  "export.downloadPref": { en: "Download in {lang}", es: "Descargar en {lang}", fr: "Télécharger en {lang}", zh: "下载（{lang}）", pt: "Baixar em {lang}", ar: "تنزيل باللغة {lang}" },
  "export.downloadEn": { en: "Download in English", es: "Descargar en inglés", fr: "Télécharger en anglais", zh: "下载英文版", pt: "Baixar em inglês", ar: "تنزيل بالإنجليزية" },

  "scanCard.title": { en: "Scan a medication", es: "Escanea un medicamento", fr: "Scanner un médicament", zh: "扫描药物", pt: "Digitalizar medicamento", ar: "امسح دواء" },
  "scanCard.desc": { en: "Snap a photo of the label — front, back, and side panels help.", es: "Toma una foto de la etiqueta — frente, reverso y laterales ayudan.", fr: "Prenez une photo de l'étiquette — recto, verso et côtés aident.", zh: "拍摄标签照片 — 正面、背面和侧面都有帮助。", pt: "Tire uma foto do rótulo — frente, verso e laterais ajudam.", ar: "التقط صورة للملصق — الأمام والخلف والجوانب تساعد." },
  "scanCard.busyDesc": { en: "Hang tight while we read the label.", es: "Un momento mientras leemos la etiqueta.", fr: "Patientez pendant la lecture de l'étiquette.", zh: "正在读取标签，请稍候。", pt: "Aguarde enquanto lemos o rótulo.", ar: "انتظر بينما نقرأ الملصق." },
  "scanCard.hint": { en: "Don't forget OTC pills and supplements — they often interact with prescriptions.", es: "No olvides los medicamentos OTC y suplementos — suelen interactuar con las recetas.", fr: "N'oubliez pas les OTC et compléments — ils interagissent souvent avec les ordonnances.", zh: "别忘了非处方药和补充剂 — 它们常与处方药相互作用。", pt: "Não se esqueça dos OTC e suplementos — eles frequentemente interagem com receitas.", ar: "لا تنسَ الأدوية بدون وصفة والمكملات — غالبًا ما تتفاعل مع الوصفات." },
  "scanCard.camera": { en: "Take photo", es: "Tomar foto", fr: "Prendre une photo", zh: "拍照", pt: "Tirar foto", ar: "التقاط صورة" },
  "scanCard.upload": { en: "Upload image", es: "Subir imagen", fr: "Téléverser une image", zh: "上传图片", pt: "Enviar imagem", ar: "رفع صورة" },

  "cat.title": { en: "Type", es: "Tipo", fr: "Type", zh: "类型", pt: "Tipo", ar: "النوع" },
  "cat.hint": { en: "Log OTC & supplements the same way as prescriptions", es: "Registra OTC y suplementos igual que las recetas", fr: "Enregistrez OTC et compléments comme les ordonnances", zh: "像处方药一样记录非处方药和补充剂", pt: "Registre OTC e suplementos como receitas", ar: "سجّل الأدوية بدون وصفة والمكملات مثل الوصفات" },
  "cat.rx": { en: "Prescription", es: "Receta", fr: "Ordonnance", zh: "处方药", pt: "Receita", ar: "بوصفة" },
  "cat.rxHint": { en: "Dispensed by a pharmacy with an Rx", es: "Dispensado por farmacia con receta", fr: "Délivré en pharmacie sur ordonnance", zh: "药房凭处方配发", pt: "Dispensado por farmácia com receita", ar: "يصرف من الصيدلية بوصفة" },
  "cat.otc": { en: "Over-the-counter", es: "Sin receta", fr: "En vente libre", zh: "非处方药", pt: "Sem receita", ar: "بدون وصفة" },
  "cat.otcHint": { en: "Bought off the shelf — pain relief, cold, allergy", es: "Comprado sin receta — dolor, resfriado, alergia", fr: "Acheté en libre-service — douleur, rhume, allergie", zh: "货架购买 — 止痛、感冒、过敏", pt: "Comprado sem receita — dor, resfriado, alergia", ar: "يُشترى بدون وصفة — مسكن، برد، حساسية" },
  "cat.supp": { en: "Supplement / Herbal", es: "Suplemento / Herbal", fr: "Complément / Phyto", zh: "补充剂 / 草药", pt: "Suplemento / Herbal", ar: "مكمل / عشبي" },
  "cat.suppHint": { en: "Vitamins, minerals, herbal remedies", es: "Vitaminas, minerales, remedios herbales", fr: "Vitamines, minéraux, phytothérapie", zh: "维生素、矿物质、草药", pt: "Vitaminas, minerais, fitoterápicos", ar: "فيتامينات ومعادن وأعشاب" },

  "allergyWarn.title": { en: "Allergy warning", es: "Alerta de alergia", fr: "Alerte allergie", zh: "过敏警告", pt: "Alerta de alergia", ar: "تحذير حساسية" },
  "allergyWarn.desc": { en: "This medicine has ingredients that match things you're allergic to:", es: "Esta medicina tiene ingredientes que coinciden con cosas a las que eres alérgico:", fr: "Ce médicament contient des ingrédients qui correspondent à vos allergies :", zh: "此药含有与您过敏的东西相匹配的成分：", pt: "Este remédio tem ingredientes que correspondem a coisas que você é alérgico:", ar: "يحتوي هذا الدواء على مكونات تطابق أشياء تعاني من حساسية تجاهها:" },
  "dupWarn.title": { en: "Same ingredient in another medicine", es: "Mismo ingrediente en otra medicina", fr: "Même ingrédient dans un autre médicament", zh: "与其他药物含有相同成分", pt: "Mesmo ingrediente em outro remédio", ar: "نفس المكون في دواء آخر" },
  "dupWarn.desc": { en: "This medicine has the same active ingredient as another one on your list. Taking both could give you too much of it.", es: "Esta medicina tiene el mismo ingrediente activo que otra en tu lista. Tomar ambas podría darte una cantidad excesiva.", fr: "Ce médicament a le même ingrédient actif qu'un autre de votre liste. Les prendre ensemble peut être excessif.", zh: "此药与列表中的另一种药物含有相同的活性成分。同时服用可能过量。", pt: "Este remédio tem o mesmo ingrediente ativo que outro da sua lista. Tomar ambos pode ser excessivo.", ar: "يحتوي هذا الدواء على نفس المكون النشط لدواء آخر في قائمتك. تناولهما معًا قد يكون مفرطًا." },
};

export function translate(lang, key, vars) {
  const entry = D[key];
  let s = (entry && (entry[lang] || entry.en)) || key;
  if (vars) {
    for (const k of Object.keys(vars)) {
      s = s.replace(new RegExp("\\{" + k + "\\}", "g"), String(vars[k]));
    }
  }
  return s;
}